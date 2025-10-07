// // ... imports ...
// import { User } from '../models/user.model';

// // ... router.post('/login', loginHandler); ...

// // مسار مؤقت لإنشاء المدير - احذفه بعد الاستخدام
// router.post('/setup-admin', async (req, res) => {
//   try {
//     const adminExists = await User.findOne({ email: 'admin@example.com' });
//     if (adminExists) {
//       return res.status(400).send('Admin already exists.');
//     }
//     await User.create({
//       email: 'admin@example.com',
//       password: 'verySecurePassword123',
//       role: 'admin'
//     });
//     res.status(201).send('Admin user created successfully!');
//   } catch (error) {
//     res.status(500).send('Error creating admin');
//   }
// });

// export default router;