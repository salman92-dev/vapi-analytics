import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req, context) {
  const { id } = await context.params;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching user by ID:", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}


// 🗑️ DELETE /api/users/[id]
export async function DELETE(req, context) {
  const { id } = await context.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}



// ✏️ PATCH /api/users/[id]
export async function PATCH(req, { params }) {
  const { id } = params;
  const { fullName, email, role } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, email = $2, role = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING *`,
      [fullName, email, role, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}