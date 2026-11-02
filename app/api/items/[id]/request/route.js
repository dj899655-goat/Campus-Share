import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getItemById, getUserById, getRequests, createRequest } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to send a borrow request." },
        { status: 401 }
      );
    }

    const { id } = params;
    const item = getItemById(id);

    if (!item) {
      return NextResponse.json(
        { error: "Item not found." },
        { status: 404 }
      );
    }

    if (item.ownerId === session.id) {
      return NextResponse.json(
        { error: "You cannot borrow an item that you listed yourself." },
        { status: 400 }
      );
    }

    if (item.status === "borrowed") {
      return NextResponse.json(
        { error: "This item is currently on loan and not available." },
        { status: 400 }
      );
    }

    // Check if the user already has an active pending request for this item
    const existingRequests = getRequests({
      itemId: id,
      borrowerId: session.id,
      status: "pending",
    });

    if (existingRequests.length > 0) {
      return NextResponse.json(
        { error: "You already have a pending request for this item." },
        { status: 400 }
      );
    }

    const user = getUserById(session.id) || session;

    const newRequest = createRequest({
      itemId: item.id,
      itemTitle: item.title,
      lenderId: item.ownerId,
      lenderName: item.ownerName,
      lenderEmail: item.ownerEmail,
      borrowerId: session.id,
      borrowerName: user.name || session.name || "Student",
      borrowerEmail: user.email || session.email,
      borrowerDob: user.dob || "",
    });

    return NextResponse.json({
      success: true,
      message: `Borrow request sent to ${item.ownerName}!`,
      request: newRequest,
    });
  } catch (err) {
    console.error("POST /api/items/[id]/request error:", err);
    return NextResponse.json(
      { error: "Failed to submit borrow request." },
      { status: 500 }
    );
  }
}

