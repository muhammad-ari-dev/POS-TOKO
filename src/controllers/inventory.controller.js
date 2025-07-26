import prisma from "../config/prisma.js";

// 👉 Get all inventory
export const getInventories = async (req, res) => {
  const inventories = await prisma.inventory.findMany();
  res.json(inventories);
};

// 👉 Get one inventory
export const getInventory = async (req, res) => {
  const { id } = req.params;
  const inventory = await prisma.inventory.findUnique({ where: { id } });
  if (!inventory)
    return res.status(404).json({ message: "Inventory tidak ditemukan" });
  res.json(inventory);
};


// 👉 Create inventory
export const createInventory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    return res.status(400).json({ message: "Nama dan deskripsi wajib diisi" });

  const inventory = await prisma.inventory.create({
    data: { name, description },
  });

  res.status(201).json({ message: "Inventory berhasil dibuat", inventory });
};


// 👉 Update inventory
export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const inventory = await prisma.inventory.update({
    where: { id },
    data: { name, description },
  });

  res.json({ message: "Inventory berhasil diupdate", inventory });
};

// 👉 Delete inventory
export const deleteInventory = async (req, res) => {
  const { id } = req.params;
  await prisma.inventory.delete({ where: { id } });
  res.json({ message: "Inventory berhasil dihapus" });
};
