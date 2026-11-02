import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getRequestById, updateRequest } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = params;
    const borrowReq = getRequestById(id);

    if (!borrowReq) {
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 }
      );
    }

    // Only the lender who owns the item can approve or decline
    if (borrowReq.lenderId !== session.id) {
      return NextResponse.json(
        { error: "You are not authorized to decide on this request." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body; // "approve" or "decline"

    if (action !== "approve" && action !== "decline") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'decline'." },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "approved" : "declined";
    const updated = updateRequest(id, { status: newStatus });

    return NextResponse.json({
      success: true,
      message: `Borrow request ${action}d successfully.`,
      request: updated,
    });
  } catch (err) {
    console.error("PATCH /api/requests/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update request." },
      { status: 500 }
    );
  }
}

