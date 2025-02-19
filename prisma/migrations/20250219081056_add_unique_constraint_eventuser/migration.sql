/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId]` on the table `EventUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EventUser_userId_eventId_key";

-- CreateIndex
CREATE UNIQUE INDEX "EventUser_eventId_userId_key" ON "EventUser"("eventId", "userId");
