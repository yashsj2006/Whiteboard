const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');

// Get all capsules for logged in user (plus public ones maybe? Let's just do user's for now)
router.get('/', auth, async (req, res) => {
  try {
    const capsules = await prisma.capsule.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(capsules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch capsules' });
  }
});

// Create a new capsule
router.post('/', auth, async (req, res) => {
  const { title, content, mediaUrl, unlockDate, isPublic } = req.body;
  try {
    const capsule = await prisma.capsule.create({
      data: {
        title,
        content,
        mediaUrl,
        unlockDate: new Date(unlockDate),
        isPublic: isPublic || false,
        authorId: req.user.id,
      },
    });
    res.status(201).json(capsule);
  } catch (err) {
    console.error("Capsule creation error:", err);
    res.status(500).json({ error: 'Failed to create capsule', details: err.message });
  }
});

// Get a specific capsule
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const capsule = await prisma.capsule.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!capsule) return res.status(404).json({ error: 'Not found' });

    // Check if locked
    const isLocked = new Date(capsule.unlockDate) > new Date();
    
    let isAuthor = false;
    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
      const jwt = require('jsonwebtoken');
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified.id === capsule.authorId) isAuthor = true;
      } catch (e) {}
    }

    // Auth check if private
    if (!capsule.isPublic && !isAuthor) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (isLocked) {
      return res.json({
        id: capsule.id,
        title: capsule.title,
        unlockDate: capsule.unlockDate,
        isLocked: true,
        isAuthor
      });
    }

    res.json({ ...capsule, isLocked: false, isAuthor });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
