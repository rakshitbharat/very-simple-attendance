-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "is_admin" BOOLEAN DEFAULT FALSE,
    "ptp" CHAR(4),
    "ptp_verified" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "clock_in" TIMESTAMP NOT NULL,
    "clock_out" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- CreateIndex
CREATE INDEX "attendance_user_id_idx" ON "attendance"("user_id");

