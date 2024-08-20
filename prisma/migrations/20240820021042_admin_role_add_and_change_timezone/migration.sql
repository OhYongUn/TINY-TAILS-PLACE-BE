-- CreateTable
CREATE TABLE "ADMINS" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "last_login_at" TIMESTAMP,
    "current_refresh_token" TEXT,
    "current_refresh_token_exp" TIMESTAMP,

    CONSTRAINT "ADMINS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROLES" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "ROLES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PERMISSIONS" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "PERMISSIONS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ADMIN_ROLES" (
    "id" SERIAL NOT NULL,
    "admin_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "ADMIN_ROLES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROLE_PERMISSIONS" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "ROLE_PERMISSIONS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ADMINS_email_key" ON "ADMINS"("email");

-- CreateIndex
CREATE INDEX "ADMINS_email_idx" ON "ADMINS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ROLES_name_key" ON "ROLES"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PERMISSIONS_name_key" ON "PERMISSIONS"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PERMISSIONS_resource_action_key" ON "PERMISSIONS"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "ADMIN_ROLES_admin_id_role_id_key" ON "ADMIN_ROLES"("admin_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "ROLE_PERMISSIONS_role_id_permission_id_key" ON "ROLE_PERMISSIONS"("role_id", "permission_id");

-- AddForeignKey
ALTER TABLE "ADMIN_ROLES" ADD CONSTRAINT "ADMIN_ROLES_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "ADMINS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ADMIN_ROLES" ADD CONSTRAINT "ADMIN_ROLES_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "ROLES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ROLE_PERMISSIONS" ADD CONSTRAINT "ROLE_PERMISSIONS_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "ROLES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ROLE_PERMISSIONS" ADD CONSTRAINT "ROLE_PERMISSIONS_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "PERMISSIONS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
