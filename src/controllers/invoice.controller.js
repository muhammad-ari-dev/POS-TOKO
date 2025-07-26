import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

// 👉 CREATE Invoice (checkout)
export const createInvoice = async (req, res) => {
  try {
    const { email, name, phone, items, total } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        email,
        name,
        phone,
        items: JSON.stringify(items), // simpan sebagai string
        total: parseFloat(total),
        date: new Date(),
        userId: req.user.id,
      },
    });

    return successResponse(res, "Invoice berhasil dibuat", {
      ...invoice,
      items: JSON.parse(invoice.items), // ✅ Parse sebelum dikirim
    });
  } catch (error) {
    return errorResponse(
      res,
      "Gagal membuat invoice",
      { error: error.message },
      500
    );
  }
};

// 👉 GET Invoice berdasarkan email
export const getInvoiceByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const invoices = await prisma.invoice.findMany({
      where: { email },
      orderBy: { date: "desc" },
    });

    if (invoices.length === 0) {
      return errorResponse(
        res,
        "Invoice tidak ditemukan untuk email tersebut",
        null,
        404
      );
    }

    const result = invoices.map((inv) => ({
      ...inv,
      items: JSON.parse(inv.items), // ✅ Parse sebelum dikirim
    }));

    return successResponse(
      res,
      "Berhasil mengambil invoice berdasarkan email",
      result
    );
  } catch (error) {
    return errorResponse(
      res,
      "Gagal mengambil invoice",
      { error: error.message },
      500
    );
  }
};

// 👉 GET Semua invoice (admin)
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { date: "desc" },
    });

    const result = invoices.map((inv) => ({
      ...inv,
      items: JSON.parse(inv.items), // ✅ Parse sebelum dikirim
    }));

    return successResponse(res, "Berhasil mengambil semua invoice", result);
  } catch (error) {
    return errorResponse(
      res,
      "Gagal mengambil invoice",
      { error: error.message },
      500
    );
  }
};

// 👉 GET Detail invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) }, // ✅ parseInt karena ID Int auto-increment
    });

    if (!invoice) {
      return errorResponse(res, "Invoice tidak ditemukan", null, 404);
    }

    return successResponse(res, "Berhasil mengambil detail invoice", {
      ...invoice,
      items: JSON.parse(invoice.items), // ✅ Parse sebelum dikirim
    });
  } catch (error) {
    return errorResponse(
      res,
      "Gagal mengambil invoice",
      { error: error.message },
      500
    );
  }
};
