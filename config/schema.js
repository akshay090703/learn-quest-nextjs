import {
  boolean,
  integer,
  json,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "expired",
]);

export const subscriptionType = pgEnum("subscription_type", [
  "monthly",
  "annual",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "Success",
  "Failed",
  "Pending",
]);

export const CourseList = pgTable("courseList", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  level: varchar("level").notNull(),
  includeVideo: varchar("includeVideo").notNull().default("Yes"),
  courseOutput: json("courseOutput").notNull(),
  createdBy: varchar("createdBy").notNull(),
  userName: varchar("username"),
  userProfileImage: varchar("userProfileImage"),
  courseBanner: varchar("courseBanner").default(
    "https://www.shutterstock.com/image-vector/training-banner-web-icon-vector-600nw-2141367327.jpg"
  ),
  publish: boolean("publish").default(false),
});

export const Chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  chapterId: integer("chapterId").notNull(),
  content: json("content").notNull(),
  videoId: varchar("videoId").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  clerkUserId: varchar("clerk_user_id").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  razorpaySubscriptionId: varchar("razorpay_subscription_id")
    .unique()
    .notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  type: subscriptionType("type").notNull(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey(), // Razorpay payment id
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  orderId: varchar("order_id").notNull(),
  amount: integer("amount").notNull(),
  status: varchar("status").notNull(),
  failureReason: varchar("failure_reason").default(null),
  errorCode: varchar("error_code").default(null),
  createdAt: timestamp("created_at").defaultNow(),
});
