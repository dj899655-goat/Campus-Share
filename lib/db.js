import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Default initial dataset with 3 seed items and demo students
const INITIAL_DB = {
  users: [
    {
      id: "usr_seed_1",
      name: "Aman Sharma",
      email: "aman.sharma@college.edu",
      dob: "2003-05-14",
      createdAt: "2026-10-01T08:00:00.000Z",
    },
    {
      id: "usr_seed_2",
      name: "Priya Patel",
      email: "priya.patel@college.edu",
      dob: "2004-02-21",
      createdAt: "2026-10-02T09:30:00.000Z",
    },
    {
      id: "usr_seed_3",
      name: "Rahul Verma",
      email: "rahul.verma@college.edu",
      dob: "2003-09-10",
      createdAt: "2026-10-03T11:15:00.000Z",
    },
  ],
  items: [
    {
      id: "item_seed_1",
      ownerId: "usr_seed_1",
      ownerName: "Aman Sharma",
      ownerEmail: "aman.sharma@college.edu",
      title: "Casio FX-991EX ClassWiz Scientific Calculator",
      category: "Electronics",
      condition: "Like New",
      pricePerDay: 25,
      deposit: 250,
      description: "Essential scientific calculator with high-res display, matrix, vectors, and equation solver. Approved for midsem and endsem exams. In working condition with case.",
      status: "available",
      createdAt: "2026-10-25T10:00:00.000Z",
    },
    {
      id: "item_seed_2",
      ownerId: "usr_seed_2",
      ownerName: "Priya Patel",
      ownerEmail: "priya.patel@college.edu",
      title: "Engineering Mechanics by Timoshenko & Young (5th Ed)",
      category: "Book",
      condition: "Good",
      pricePerDay: 15,
      deposit: 150,
      description: "Standard syllabus textbook for 1st & 2nd year engineering students. Clean pages with no missing leaves or ink scribbles. Great for exam prep.",
      status: "available",
      createdAt: "2026-10-26T12:30:00.000Z",
    },
    {
      id: "item_seed_3",
      ownerId: "usr_seed_3",
      ownerName: "Rahul Verma",
      ownerEmail: "rahul.verma@college.edu",
      title: "Standard White Lab Coat (Size M - 100% Cotton)",
      category: "Lab equipment",
      condition: "Good",
      pricePerDay: 20,
      deposit: 100,
      description: "Clean, freshly ironed white cotton laboratory coat with deep pockets. Mandatory for Chemistry, Physics, and Bio practical labs.",
      status: "available",
      createdAt: "2026-10-27T09:15:00.000Z",
    },
  ],
  requests: [],
};

/**
 * Ensures data directory and db.json exist, then returns parsed database
 */
export function getDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf8");
      return JSON.parse(JSON.stringify(INITIAL_DB));
    }

    const fileContent = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("Error reading database:", err);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }
}

/**
 * Writes data object to db.json safely
 */
export function saveDb(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error saving database:", err);
    return false;
  }
}

// ================= USER HELPERS =================

export function getUsers() {
  const db = getDb();
  return db.users || [];
}

export function getUserById(id) {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}

export function getUserByEmail(email) {
  if (!email) return null;
  const users = getUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function createUser({ name, email, dob }) {
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if existing user
  let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (user) {
    // Update name and dob if provided
    if (name) user.name = name.trim();
    if (dob) user.dob = dob.trim();
    saveDb(db);
    return user;
  }

  user = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name ? name.trim() : normalizedEmail.split("@")[0],
    email: normalizedEmail,
    dob: dob ? dob.trim() : "",
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  saveDb(db);
  return user;
}

// ================= ITEM HELPERS =================

export function getItems(filter = {}) {
  const db = getDb();
  let items = db.items || [];

  if (filter.ownerId) {
    items = items.filter((item) => item.ownerId === filter.ownerId);
  }

  if (filter.status) {
    items = items.filter((item) => item.status === filter.status);
  }

  if (filter.category && filter.category !== "all") {
    items = items.filter(
      (item) => item.category.toLowerCase() === filter.category.toLowerCase()
    );
  }

  if (filter.search) {
    const q = filter.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getItemById(id) {
  const db = getDb();
  return (db.items || []).find((item) => item.id === id) || null;
}

export function createItem(itemData) {
  const db = getDb();
  const newItem = {
    id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ownerId: itemData.ownerId,
    ownerName: itemData.ownerName,
    ownerEmail: itemData.ownerEmail,
    title: itemData.title.trim(),
    category: itemData.category || "Other",
    condition: itemData.condition || "Good",
    pricePerDay: Number(itemData.pricePerDay) || 0,
    deposit: Number(itemData.deposit) || 0,
    description: itemData.description ? itemData.description.trim() : "",
    status: "available", // 'available' | 'requested' | 'borrowed'
    createdAt: new Date().toISOString(),
  };

  db.items.push(newItem);
  saveDb(db);
  return newItem;
}

export function updateItem(id, updates) {
  const db = getDb();
  const itemIndex = db.items.findIndex((item) => item.id === id);
  if (itemIndex === -1) return null;

  db.items[itemIndex] = {
    ...db.items[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDb(db);
  return db.items[itemIndex];
}

export function deleteItem(id) {
  const db = getDb();
  const initialLength = db.items.length;
  db.items = db.items.filter((item) => item.id !== id);
  if (db.items.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ================= REQUEST HELPERS =================

export function getRequests(filter = {}) {
  const db = getDb();
  let requests = db.requests || [];

  if (filter.lenderId) {
    requests = requests.filter((r) => r.lenderId === filter.lenderId);
  }

  if (filter.borrowerId) {
    requests = requests.filter((r) => r.borrowerId === filter.borrowerId);
  }

  if (filter.itemId) {
    requests = requests.filter((r) => r.itemId === filter.itemId);
  }

  if (filter.status) {
    requests = requests.filter((r) => r.status === filter.status);
  }

  // Sort newest first
  return requests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
}

export function getRequestById(id) {
  const db = getDb();
  return (db.requests || []).find((r) => r.id === id) || null;
}

export function createRequest(reqData) {
  const db = getDb();
  const newReq = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    itemId: reqData.itemId,
    itemTitle: reqData.itemTitle,
    lenderId: reqData.lenderId,
    lenderName: reqData.lenderName,
    lenderEmail: reqData.lenderEmail,
    borrowerId: reqData.borrowerId,
    borrowerName: reqData.borrowerName,
    borrowerEmail: reqData.borrowerEmail,
    borrowerDob: reqData.borrowerDob || "",
    status: "pending", // 'pending' | 'approved' | 'declined'
    requestDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.requests.push(newReq);

  // Update item status to 'requested'
  const itemIndex = db.items.findIndex((i) => i.id === reqData.itemId);
  if (itemIndex !== -1) {
    db.items[itemIndex].status = "requested";
  }

  saveDb(db);
  return newReq;
}

export function updateRequest(id, updates) {
  const db = getDb();
  const reqIndex = db.requests.findIndex((r) => r.id === id);
  if (reqIndex === -1) return null;

  const currentReq = db.requests[reqIndex];
  db.requests[reqIndex] = {
    ...currentReq,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // If approved: mark item as borrowed and decline other pending requests for the same item
  if (updates.status === "approved") {
    const itemIndex = db.items.findIndex((i) => i.id === currentReq.itemId);
    if (itemIndex !== -1) {
      db.items[itemIndex].status = "borrowed";
    }

    // Auto-decline other pending requests for this item
    db.requests.forEach((r, idx) => {
      if (r.itemId === currentReq.itemId && r.id !== id && r.status === "pending") {
        db.requests[idx].status = "declined";
        db.requests[idx].updatedAt = new Date().toISOString();
      }
    });
  }

  // If declined: check if other pending requests exist; if not, revert item to 'available'
  if (updates.status === "declined") {
    const hasOtherPending = db.requests.some(
      (r) => r.itemId === currentReq.itemId && r.id !== id && r.status === "pending"
    );
    if (!hasOtherPending) {
      const itemIndex = db.items.findIndex((i) => i.id === currentReq.itemId);
      if (itemIndex !== -1 && db.items[itemIndex].status !== "borrowed") {
        db.items[itemIndex].status = "available";
      }
    }
  }

  saveDb(db);
  return db.requests[reqIndex];
}

