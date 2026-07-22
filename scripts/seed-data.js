const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const sampleProducts = [
  {
    name: 'Panduan Photoshop Lengkap 2025',
    description: 'Tutorial fotografi dan editing menggunakan Adobe Photoshop dari pemula hingga mahir',
    price: '49999',
    category: 'ebook',
    downloadUrl: 'https://example.com/photoshop-guide.zip',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
  },
  {
    name: 'Template Website Modern Responsive',
    description: 'Koleksi 50+ template HTML/CSS siap pakai untuk berbagai jenis website',
    price: '79999',
    category: 'template',
    downloadUrl: 'https://example.com/templates.zip',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
  },
  {
    name: 'Kursus JavaScript Pro - Build Real Apps',
    description: 'Belajar JavaScript profesional dengan project real-world yang akan meningkatkan skill Anda',
    price: '299999',
    category: 'course',
    downloadUrl: 'https://example.com/javascript-course.zip',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
  },
  {
    name: 'SEO Master - Ranking #1 Google',
    description: 'Strategi SEO terbaru 2025 untuk mendominasi halaman pertama Google',
    price: '149999',
    category: 'ebook',
    downloadUrl: 'https://example.com/seo-guide.pdf',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
  },
  {
    name: 'Figma Design System Kit',
    description: 'Lengkap design system untuk membangun UI/UX yang konsisten dan professional',
    price: '89999',
    category: 'template',
    downloadUrl: 'https://example.com/figma-kit.fig',
    image: 'https://images.unsplash.com/photo-1561580050-7aaeebc4e388?w=500&h=300&fit=crop',
  },
  {
    name: 'Digital Marketing Blueprint 2025',
    description: 'Panduan lengkap digital marketing dari strategi hingga implementasi dan analytics',
    price: '199999',
    category: 'course',
    downloadUrl: 'https://example.com/digital-marketing.zip',
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=300&fit=crop',
  },
]

async function seedData() {
  const client = await pool.connect()
  try {
    console.log('🌱 Seeding RAKUNSHOP.ID database...')

    // Get admin user ID (you need to create an admin first)
    // For this seed, we'll use a placeholder. Replace with actual admin ID
    const adminUserId = 'admin-user-id-placeholder'

    for (const product of sampleProducts) {
      const query = `
        INSERT INTO products (userId, name, description, price, category, downloadUrl, image, isActive, createdAt, updatedAt)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `
      await client.query(query, [
        adminUserId,
        product.name,
        product.description,
        product.price,
        product.category,
        product.downloadUrl,
        product.image,
        true,
      ])
      console.log(`✅ Added: ${product.name}`)
    }

    console.log('✨ Data seeding complete!')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

seedData()
