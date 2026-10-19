import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { query, queryOne, run } from '../db';
import { PortfolioProject } from '../types';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../services/audit';

export const portfolioRouter = Router();

// Helper to validate and save uploaded portfolio image
function savePortfolioImage(id: string, imageData: string, index = 0): string {
  const matches = imageData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image format. Supported formats: JPG, PNG, WebP.');
  }

  let ext = matches[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  const base64Buffer = Buffer.from(matches[2], 'base64');

  if (base64Buffer.length > 10 * 1024 * 1024) {
    throw new Error('Selected image exceeds the maximum size limit of 10MB.');
  }

  const portfolioUploadsDir = path.resolve(process.cwd(), 'uploads/portfolio');
  if (!fs.existsSync(portfolioUploadsDir)) {
    fs.mkdirSync(portfolioUploadsDir, { recursive: true });
  }

  const filename = `portfolio_${id}_${Date.now()}_${index}.${ext}`;
  const filePath = path.join(portfolioUploadsDir, filename);
  fs.writeFileSync(filePath, base64Buffer);

  // Sync to client public directory for seamless Vite dev access
  try {
    const clientUploadsDir = path.resolve(process.cwd(), '../client/public/uploads/portfolio');
    if (!fs.existsSync(clientUploadsDir)) {
      fs.mkdirSync(clientUploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(clientUploadsDir, filename), base64Buffer);
  } catch (_syncErr) {
    // Non-critical in standalone production environments
  }

  return `/uploads/portfolio/${filename}`;
}

// GET /api/portfolio (Public: published portfolio projects with optional category filter)
portfolioRouter.get('/', (req, res) => {
  try {
    const category = req.query.category as string;
    let projects: any[];

    if (category && category !== 'All') {
      projects = query<any>(
        `SELECT * FROM portfolio_projects 
         WHERE is_published = 1 AND category = ? 
         ORDER BY created_at DESC`,
        [category]
      );
    } else {
      projects = query<any>(
        `SELECT * FROM portfolio_projects 
         WHERE is_published = 1 
         ORDER BY created_at DESC`
      );
    }

    const formatted = projects.map(p => {
      let gallery: string[] = [];
      try {
        gallery = JSON.parse(p.gallery_images || '[]');
      } catch (_e) {
        gallery = [];
      }
      if (p.cover_image && !gallery.includes(p.cover_image)) {
        gallery.unshift(p.cover_image);
      }

      let highlights: string[] = [];
      try {
        highlights = JSON.parse(p.architecture_highlights || '[]');
      } catch (_e) {
        highlights = [];
      }

      return {
        ...p,
        role: p.role || 'Full Stack Developer',
        technologies: JSON.parse(p.technologies || '[]'),
        gallery_images: gallery,
        architecture_highlights: highlights,
        architectureHighlights: highlights,
        completion_date: p.completion_date || 'Delivered',
        completionDate: p.completion_date || 'Delivered',
        is_published: Boolean(p.is_published),
      };
    });

    res.json({ projects: formatted });
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ error: 'Failed to retrieve portfolio entries.' });
  }
});

// GET /api/portfolio/:slug (Public: single case study detail)
portfolioRouter.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const project = queryOne<any>(
      `SELECT * FROM portfolio_projects WHERE slug = ? AND is_published = 1`,
      [slug]
    );

    if (!project) {
      res.status(404).json({ error: 'Case study not found.' });
      return;
    }

    let gallery: string[] = [];
    try {
      gallery = JSON.parse(project.gallery_images || '[]');
    } catch (_e) {
      gallery = [];
    }
    if (project.cover_image && !gallery.includes(project.cover_image)) {
      gallery.unshift(project.cover_image);
    }

    let highlights: string[] = [];
    try {
      highlights = JSON.parse(project.architecture_highlights || '[]');
    } catch (_e) {
      highlights = [];
    }

    res.json({
      project: {
        ...project,
        role: project.role || 'Full Stack Developer',
        technologies: JSON.parse(project.technologies || '[]'),
        gallery_images: gallery,
        architecture_highlights: highlights,
        architectureHighlights: highlights,
        completion_date: project.completion_date || 'Delivered',
        completionDate: project.completion_date || 'Delivered',
        is_published: Boolean(project.is_published),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve case study.' });
  }
});

// POST /api/portfolio/:id/images (Admin only: Upload multiple screenshots for project gallery)
portfolioRouter.post('/:id/images', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const { imagesData, imageData, imageUrls, imageUrl } = req.body;

    const existing = queryOne<{ id: string; title: string; cover_image: string; gallery_images: string }>(
      'SELECT id, title, cover_image, gallery_images FROM portfolio_projects WHERE id = ?',
      [id]
    );
    if (!existing) {
      res.status(404).json({ error: 'Portfolio item not found.' });
      return;
    }

    const payloadList: string[] = [];
    if (Array.isArray(imagesData)) {
      payloadList.push(...imagesData.filter(d => typeof d === 'string' && d.startsWith('data:image/')));
    } else if (imageData && typeof imageData === 'string' && imageData.startsWith('data:image/')) {
      payloadList.push(imageData);
    }

    const urlList: string[] = [];
    if (Array.isArray(imageUrls)) {
      urlList.push(...imageUrls.filter(u => typeof u === 'string' && u.trim().length > 0));
    } else if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
      urlList.push(imageUrl.trim());
    }

    if (payloadList.length === 0 && urlList.length === 0) {
      res.status(400).json({ error: 'Please select one or more image files (JPG, PNG, WebP) to upload.' });
      return;
    }

    const newlySavedUrls: string[] = [];
    for (let i = 0; i < payloadList.length; i++) {
      const saved = savePortfolioImage(id, payloadList[i], i);
      newlySavedUrls.push(saved);
    }
    newlySavedUrls.push(...urlList);

    let existingGallery: string[] = [];
    try {
      existingGallery = JSON.parse(existing.gallery_images || '[]');
    } catch (_e) {
      existingGallery = [];
    }
    if (existing.cover_image && !existingGallery.includes(existing.cover_image)) {
      existingGallery.unshift(existing.cover_image);
    }

    // Merge without duplicates
    const combinedGallery = Array.from(new Set([...existingGallery, ...newlySavedUrls]));
    const primaryCover = existing.cover_image && existing.cover_image.trim().length > 0
      ? existing.cover_image
      : combinedGallery[0] || '';

    const now = new Date().toISOString();
    run(
      'UPDATE portfolio_projects SET cover_image = ?, gallery_images = ?, updated_at = ? WHERE id = ?',
      [primaryCover, JSON.stringify(combinedGallery), now, id]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'PORTFOLIO_IMAGES_UPLOADED',
      entityType: 'PORTFOLIO',
      entityId: id,
      details: { title: existing.title, uploadedCount: newlySavedUrls.length, totalGalleryCount: combinedGallery.length },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      count: newlySavedUrls.length,
      coverImage: primaryCover,
      galleryImages: combinedGallery,
      message: `${newlySavedUrls.length} screenshot(s) uploaded successfully for "${existing.title}".`,
    });
  } catch (err: any) {
    console.error('Error uploading portfolio images:', err);
    res.status(500).json({ error: err.message || 'An error occurred while uploading screenshots.' });
  }
});

// POST /api/portfolio/:id/image (Admin only: Backward-compatible single upload)
portfolioRouter.post('/:id/image', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const { imageData, imageUrl } = req.body;

    const existing = queryOne<{ id: string; title: string; cover_image: string; gallery_images: string }>(
      'SELECT id, title, cover_image, gallery_images FROM portfolio_projects WHERE id = ?',
      [id]
    );
    if (!existing) {
      res.status(404).json({ error: 'Portfolio item not found.' });
      return;
    }

    let finalImageUrl = '';

    if (imageData && typeof imageData === 'string' && imageData.startsWith('data:image/')) {
      finalImageUrl = savePortfolioImage(id, imageData, 0);
    } else if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
      finalImageUrl = imageUrl.trim();
    } else {
      res.status(400).json({ error: 'Please select an image file or provide a valid image URL.' });
      return;
    }

    let existingGallery: string[] = [];
    try {
      existingGallery = JSON.parse(existing.gallery_images || '[]');
    } catch (_e) {
      existingGallery = [];
    }
    const combinedGallery = Array.from(new Set([finalImageUrl, ...existingGallery]));

    const now = new Date().toISOString();
    run('UPDATE portfolio_projects SET cover_image = ?, gallery_images = ?, updated_at = ? WHERE id = ?', [
      finalImageUrl,
      JSON.stringify(combinedGallery),
      now,
      id,
    ]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'PORTFOLIO_IMAGE_UPDATED',
      entityType: 'PORTFOLIO',
      entityId: id,
      details: { title: existing.title, coverImage: finalImageUrl },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Project image updated successfully for "${existing.title}".`,
      coverImage: finalImageUrl,
      galleryImages: combinedGallery,
    });
  } catch (err: any) {
    console.error('Error uploading portfolio image:', err);
    res.status(500).json({ error: err.message || 'An error occurred while uploading project image.' });
  }
});

// PATCH /api/portfolio/:id/cover (Admin only: Set specific image as primary cover)
portfolioRouter.patch('/:id/cover', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const coverImage = (req.body?.coverImage || req.body?.imageUrl || '') as string;

    if (!coverImage || typeof coverImage !== 'string' || coverImage.trim().length === 0) {
      res.status(400).json({ error: 'Please specify the cover image URL.' });
      return;
    }

    const existing = queryOne<{ id: string; title: string; gallery_images: string }>(
      'SELECT id, title, gallery_images FROM portfolio_projects WHERE id = ?',
      [id]
    );
    if (!existing) {
      res.status(404).json({ error: 'Portfolio item not found.' });
      return;
    }

    const now = new Date().toISOString();
    run('UPDATE portfolio_projects SET cover_image = ?, updated_at = ? WHERE id = ?', [
      coverImage.trim(),
      now,
      id,
    ]);

    res.json({
      success: true,
      coverImage: coverImage.trim(),
      message: `Cover image updated for "${existing.title}".`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cover image.' });
  }
});

// DELETE /api/portfolio/:id/image (Admin only: Remove specific image from gallery or clear all)
portfolioRouter.delete('/:id/image', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const targetUrl = (req.body?.imageUrl || req.query?.imageUrl || '') as string;

    const existing = queryOne<{ id: string; title: string; cover_image: string; gallery_images: string }>(
      'SELECT id, title, cover_image, gallery_images FROM portfolio_projects WHERE id = ?',
      [id]
    );
    if (!existing) {
      res.status(404).json({ error: 'Portfolio item not found.' });
      return;
    }

    let gallery: string[] = [];
    try {
      gallery = JSON.parse(existing.gallery_images || '[]');
    } catch (_e) {
      gallery = [];
    }

    let newCover = existing.cover_image;
    let newGallery = gallery;

    if (targetUrl && targetUrl.trim().length > 0) {
      newGallery = gallery.filter(u => u !== targetUrl.trim());
      if (newCover === targetUrl.trim()) {
        newCover = newGallery[0] || '';
      }
    } else {
      // Clear all
      newGallery = [];
      newCover = '';
    }

    const now = new Date().toISOString();
    run('UPDATE portfolio_projects SET cover_image = ?, gallery_images = ?, updated_at = ? WHERE id = ?', [
      newCover,
      JSON.stringify(newGallery),
      now,
      id,
    ]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'PORTFOLIO_IMAGE_REMOVED',
      entityType: 'PORTFOLIO',
      entityId: id,
      details: { title: existing.title, removedImage: targetUrl || 'ALL' },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      coverImage: newCover,
      galleryImages: newGallery,
      message: targetUrl ? `Screenshot removed from gallery.` : `All images removed for "${existing.title}".`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove project image.' });
  }
});

// POST /api/portfolio (Admin only: create new case study with full architecture fields & screenshots)
portfolioRouter.post('/', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      role,
      shortDesc,
      short_desc,
      fullDesc,
      full_desc,
      category,
      technologies,
      coverImage,
      cover_image,
      imageData,
      imagesData,
      projectUrl,
      project_url,
      repoUrl,
      repo_url,
      completionDate,
      completion_date,
      challenge,
      solution,
      architectureHighlights,
      architecture_highlights,
      results,
    } = req.body;

    const finalTitle = (title || '').trim();
    const finalRole = (role || 'Full Stack Developer').trim();
    const finalShortDesc = (shortDesc || short_desc || '').trim();
    const finalFullDesc = (fullDesc || full_desc || '').trim();
    const finalCategory = (category || 'Full-Stack Web Applications').trim();
    const finalChallenge = (challenge || '').trim();
    const finalSolution = (solution || '').trim();
    const finalResults = (results || '').trim();
    const finalRepoUrl = (repoUrl || repo_url || '').trim();
    const finalProjectUrl = (projectUrl || project_url || '').trim();
    const finalCompletionDate = (completionDate || completion_date || 'Completed').trim();

    if (!finalTitle || !finalShortDesc || !finalFullDesc || !finalCategory || !finalChallenge || !finalSolution) {
      res.status(400).json({ error: 'Please provide all required case study fields: Title, Role, Short Description, Full Description, Category, Challenge, and Solution.' });
      return;
    }

    const id = uuidv4();
    const slug = finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    // Parse technologies array
    let parsedTech: string[] = [];
    if (Array.isArray(technologies)) {
      parsedTech = technologies.filter(t => typeof t === 'string' && t.trim().length > 0);
    } else if (typeof technologies === 'string' && technologies.trim().length > 0) {
      parsedTech = technologies.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Parse architecture highlights array
    let parsedHighlights: string[] = [];
    const rawHighlights = architectureHighlights ?? architecture_highlights;
    if (Array.isArray(rawHighlights)) {
      parsedHighlights = rawHighlights.filter(h => typeof h === 'string' && h.trim().length > 0);
    } else if (typeof rawHighlights === 'string' && rawHighlights.trim().length > 0) {
      parsedHighlights = rawHighlights
        .split('\n')
        .map(s => s.trim().replace(/^[-*•\d.]+\s*/, ''))
        .filter(Boolean);
    }

    // Process screenshots / gallery uploads
    const savedGallery: string[] = [];
    if (Array.isArray(imagesData)) {
      imagesData.forEach((d, idx) => {
        if (typeof d === 'string' && d.startsWith('data:image/')) {
          try {
            savedGallery.push(savePortfolioImage(id, d, idx));
          } catch (_e) {}
        }
      });
    } else if (imageData && typeof imageData === 'string' && imageData.startsWith('data:image/')) {
      try {
        savedGallery.push(savePortfolioImage(id, imageData, 0));
      } catch (_e) {}
    }

    const directCover = coverImage || cover_image || '';
    const primaryCover = directCover || savedGallery[0] || '';
    if (primaryCover && !savedGallery.includes(primaryCover)) {
      savedGallery.unshift(primaryCover);
    }

    run(
      `INSERT INTO portfolio_projects (
        id, title, slug, role, short_desc, full_desc, category, technologies,
        cover_image, gallery_images, project_url, repo_url, completion_date,
        challenge, solution, architecture_highlights, results,
        is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        id,
        finalTitle,
        slug,
        finalRole,
        finalShortDesc,
        finalFullDesc,
        finalCategory,
        JSON.stringify(parsedTech),
        primaryCover,
        JSON.stringify(savedGallery),
        finalProjectUrl || null,
        finalRepoUrl || null,
        finalCompletionDate,
        finalChallenge,
        finalSolution,
        JSON.stringify(parsedHighlights),
        finalResults || null,
        now,
        now,
      ]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'PORTFOLIO_CREATED',
      entityType: 'PORTFOLIO',
      entityId: id,
      details: { title: finalTitle, role: finalRole, category: finalCategory, screenshotsCount: savedGallery.length },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      id,
      slug,
      message: `Case study "${finalTitle}" published successfully to portfolio.`,
    });
  } catch (err: any) {
    console.error('Error creating portfolio project:', err);
    res.status(500).json({ error: err.message || 'Failed to create case study.' });
  }
});

// PATCH /api/portfolio/:id (Admin only: update project details, role, highlights, status, urls)
portfolioRouter.patch('/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const {
      title,
      role,
      shortDesc,
      short_desc,
      fullDesc,
      full_desc,
      category,
      technologies,
      coverImage,
      cover_image,
      galleryImages,
      gallery_images,
      projectUrl,
      project_url,
      repoUrl,
      repo_url,
      completionDate,
      completion_date,
      challenge,
      solution,
      architectureHighlights,
      architecture_highlights,
      results,
      isPublished,
      is_published,
    } = req.body;

    const existing = queryOne('SELECT * FROM portfolio_projects WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Portfolio item not found.' });
      return;
    }

    const now = new Date().toISOString();

    // Parse technologies if supplied
    let techJson: string | null = null;
    if (technologies !== undefined) {
      if (Array.isArray(technologies)) {
        techJson = JSON.stringify(technologies.filter(t => typeof t === 'string' && t.trim().length > 0));
      } else if (typeof technologies === 'string') {
        techJson = JSON.stringify(technologies.split(',').map(s => s.trim()).filter(Boolean));
      }
    }

    // Parse architecture highlights if supplied
    let highlightsJson: string | null = null;
    const rawHighlights = architectureHighlights !== undefined ? architectureHighlights : architecture_highlights;
    if (rawHighlights !== undefined) {
      if (Array.isArray(rawHighlights)) {
        highlightsJson = JSON.stringify(rawHighlights.filter(h => typeof h === 'string' && h.trim().length > 0));
      } else if (typeof rawHighlights === 'string') {
        highlightsJson = JSON.stringify(
          rawHighlights
            .split('\n')
            .map(s => s.trim().replace(/^[-*•\d.]+\s*/, ''))
            .filter(Boolean)
        );
      }
    }

    // Parse gallery images if supplied
    let galleryJson: string | null = null;
    const rawGallery = galleryImages !== undefined ? galleryImages : gallery_images;
    if (rawGallery !== undefined) {
      if (Array.isArray(rawGallery)) {
        galleryJson = JSON.stringify(rawGallery);
      }
    }

    const resolvedPublished = isPublished !== undefined ? isPublished : is_published;

    run(
      `UPDATE portfolio_projects
       SET title = COALESCE(?, title),
           role = COALESCE(?, role),
           short_desc = COALESCE(?, short_desc),
           full_desc = COALESCE(?, full_desc),
           category = COALESCE(?, category),
           technologies = CASE WHEN ? IS NOT NULL THEN ? ELSE technologies END,
           cover_image = COALESCE(?, cover_image),
           gallery_images = CASE WHEN ? IS NOT NULL THEN ? ELSE gallery_images END,
           project_url = COALESCE(?, project_url),
           repo_url = COALESCE(?, repo_url),
           completion_date = COALESCE(?, completion_date),
           challenge = COALESCE(?, challenge),
           solution = COALESCE(?, solution),
           architecture_highlights = CASE WHEN ? IS NOT NULL THEN ? ELSE architecture_highlights END,
           results = COALESCE(?, results),
           is_published = COALESCE(?, is_published),
           updated_at = ?
       WHERE id = ?`,
      [
        title ?? null,
        role ?? null,
        shortDesc ?? short_desc ?? null,
        fullDesc ?? full_desc ?? null,
        category ?? null,
        techJson,
        techJson,
        coverImage ?? cover_image ?? null,
        galleryJson,
        galleryJson,
        projectUrl !== undefined ? (projectUrl ?? null) : (project_url !== undefined ? project_url : null),
        repoUrl !== undefined ? (repoUrl ?? null) : (repo_url !== undefined ? repo_url : null),
        completionDate ?? completion_date ?? null,
        challenge ?? null,
        solution ?? null,
        highlightsJson,
        highlightsJson,
        results ?? null,
        typeof resolvedPublished === 'boolean' ? (resolvedPublished ? 1 : 0) : null,
        now,
        id,
      ]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'PORTFOLIO_UPDATED',
      entityType: 'PORTFOLIO',
      entityId: id,
      details: { title, role, coverImage, projectUrl, repoUrl, isPublished: resolvedPublished },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Portfolio project updated successfully.' });
  } catch (err: any) {
    console.error('Error updating portfolio project:', err);
    res.status(500).json({ error: err.message || 'Failed to update portfolio project.' });
  }
});

// DELETE /api/portfolio/:id (Admin only: delete portfolio case study)
portfolioRouter.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const existing = queryOne('SELECT id FROM portfolio_projects WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Portfolio project not found.' });
      return;
    }

    run('DELETE FROM portfolio_projects WHERE id = ?', [id]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'PORTFOLIO_DELETED',
      entityType: 'PORTFOLIO',
      entityId: id,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Portfolio project deleted successfully.' });
  } catch (err) {
    console.error('Error deleting portfolio project:', err);
    res.status(500).json({ error: 'Failed to delete portfolio project.' });
  }
});
