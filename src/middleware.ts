import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Kiểm tra quyền truy cập admin
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      // Chuyển hướng khách hàng thường về trang store
      return NextResponse.redirect(new URL("/store", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Trả về true nếu token tồn tại (người dùng đã đăng nhập)
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  // Các tuyến đường cần được bảo vệ bằng middleware
  matcher: [
    "/admin/:path*",
    "/orders/:path*",
    "/checkout/payment/:path*",
  ],
};
