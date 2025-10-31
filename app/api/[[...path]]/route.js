import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { reviewCode } from "@/lib/llm-service";
import { v4 as uuidv4 } from "uuid";

// POST /api/review - Submit code for review
async function handleReview(request) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }
if (code.length > 10000) {
  return NextResponse.json(
    { error: "Code too long (max 10,000 characters)" },
    { status: 400 }
  );
}

    // Get AI review
    const review = await reviewCode(code, language);

    // Save to database
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "codesense_ai");

    const reviewDoc = {
      id: uuidv4(),
      code,
      language,
      summary: review.summary,
      bugs: review.bugs,
      optimizations: review.optimizations,
      readability: review.readability,
      refactored: review.refactored,
      explanation: review.explanation,
      qualityScore: review.qualityScore,
      createdAt: new Date(),
    };

    await db.collection("reviews").insertOne(reviewDoc);

    return NextResponse.json({
      success: true,
      review: reviewDoc,
    });
  } catch (error) {
    console.error("Review API Error:", error);
    return NextResponse.json(
      { error: "Failed to review code", details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/reviews - Get all reviews
async function handleGetReviews() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "codesense_ai");

    const reviews = await db
      .collection("reviews")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// GET /api/review/:id - Get single review
async function handleGetReview(id) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "codesense_ai");

    const review = await db.collection("reviews").findOne({ id });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Get Review Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const pathname = request.nextUrl.pathname;


  if (pathname === "/api/reviews") {
    return handleGetReviews();
  } else if (pathname.startsWith("/api/review/")) {
    const id = pathname.split("/").pop();
    return handleGetReview(id);
  }

  return NextResponse.json({ message: "CodeSense AI API" });
}

export async function POST(request) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/api/review") {
    return handleReview(request);
  }

  return NextResponse.json({ error: "Route not found" }, { status: 404 });
}
