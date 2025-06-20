const router = require('express').Router();
const multer = require('multer');
const Product = require('../models/Product');
const redisClient = require('../utils/redisClient');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadToS3 } = require('../utils/s3Uploader'); // Custom utility

const cacheTTL = 3600; // 1 hour

// Multer memory storage for S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// === CREATE ===
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadToS3(req.file); // Upload image to S3
    }

    const product = await Product.create({
      name,
      price,
      description,
      image: imageUrl,
    });

    // Invalidate cache
    await redisClient.del('all-products');
    
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// === READ ALL ===
router.get('/', authMiddleware, async (req, res) => {
  const cached = await redisClient.get('all-products');
  if (cached) return res.json(JSON.parse(cached));

  const products = await Product.find();
  await redisClient.set('all-products', JSON.stringify(products), { EX: cacheTTL });
  res.json(products);
});

// === READ ONE ===
router.get('/:id', authMiddleware, async (req, res) => {
  const key = `product:${req.params.id}`;
  const cached = await redisClient.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const product = await Product.findById(req.params.id);
  if (!product) return res.sendStatus(404);

  await redisClient.set(key, JSON.stringify(product), { EX: cacheTTL });
  res.json(product);
});

// === UPDATE ===
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updateFields = { ...req.body };

    if (req.file) {
      updateFields.image = await uploadToS3(req.file); // Replace image if provided
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
  if (!updated) return res.sendStatus(404);

    // Invalidate cache
  await redisClient.del(`product:${req.params.id}`);
  await redisClient.del('all-products');

  res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// === DELETE ===
router.delete('/:id', authMiddleware, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.sendStatus(404);

  await redisClient.del(`product:${req.params.id}`);
  await redisClient.del('all-products');

  res.sendStatus(204);
});

module.exports = router;
