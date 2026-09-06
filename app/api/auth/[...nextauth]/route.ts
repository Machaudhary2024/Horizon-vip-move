import { handlers } from "@/lib/auth";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import type { NextRequest } from "next/server";

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
	if (new URL(request.url).pathname.endsWith("/callback/credentials")) {
		const rateLimit = await rateLimitMiddleware(request, "login");
		if (!rateLimit.allowed) return rateLimit.response;
	}

	return handlers.POST(request);
}
