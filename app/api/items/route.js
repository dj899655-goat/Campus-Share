import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getItems, createItem, getUserById } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/items - list items
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isMine = searchParams.get("mine") === "1";
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (isMine) {
      const session = getSessionUser(request);
      if (!session) {
        return NextResponse.json(
          { error: "Authentication required to view your listed items." },
          { status: 401 }
        );
      }
      const myItems = getItems({ ownerId: session.id, search, category });
      return NextResponse.json({ items: myItems });
    }

    // Public / borrow feed: return items
    const items = getItems({ category, search });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/items error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve items." },
      { status: 500 }
    );
  }
}

// POST /api/items - create new item
export async function POST(request) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to list an item." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, condition, pricePerDay, deposit } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Item title is required." },
        { status: 400 }
      );
    }

    const parsedPrice = Number(pricePerDay);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: "Please enter a valid price per day." },
        { status: 400 }
      );
    }

    const user = getUserById(session.id) || session;

    const newItem = createItem({
      ownerId: session.id,
      ownerName: user.name || session.name || "Student",
      ownerEmail: user.email || session.email,
      title: title.trim(),
      description: description || "",
      category: category || "Other",
      condition: condition || "Good",
      pricePerDay: parsedPrice,
      deposit: Number(deposit) || 0,
    });

    return NextResponse.json(
      { success: true, item: newItem },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/items error:", err);
    return NextResponse.json(
      { error: "Failed to list item." },
      { status: 500 }
    );
  }
}

