import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { SubscriptionProvider } from "./_context/SubscriptionContext";
import { UserCourseListProvider } from "./_context/UserCourseListContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const outift = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "LearnQuest",
  description: "AI automated Course Generator",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        {/* <GoogleOneTap /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SubscriptionProvider>
            <UserCourseListProvider>
              <body
                // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                className={outift.className}
              >
                <Toaster position="top-center" />
                {children}
              </body>
            </UserCourseListProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
