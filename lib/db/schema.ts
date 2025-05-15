import { integer, pgTable, text, uuid, boolean, timestamp} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const files = pgTable("files", {
    id: uuid("id").primaryKey().defaultRandom(),

    //basic file and folder info stored in the database
    name: text("name").notNull(), // file name
    path: text("path").notNull(), // file path
    size: integer("size").notNull(), // file size in bytes
    type: text("type").notNull(), // file type (e.g. image, video, document)

    // storage info
    fileUrl: text("file_url").notNull(), // file URL in S3 bucket
    thumbnailUrl: text("thumbnail_url").notNull(), // thumbnail URL in S3 bucket

    // ownership info

    ownerId: uuid("user_id").notNull(), // user ID of the file owner
    parentId: uuid("parent_id"), // parent folder ID (if any)

    // file / folder flags
    isFolder: boolean("is_folder").notNull().default(false), // is this a folder?
    isStarred: boolean("is_starred").notNull().default(false), // is this file starred?
    isTrash: boolean("is_t rash").notNull().default(false), // is this file in trash?

    //Timestamps 
    createdAt: timestamp("created_at").defaultNow().notNull(), // creation timestamp
    updatedAt: timestamp("updated_at").defaultNow().notNull(), // last update timestamp
})

export const filesRelations = relations(files, ({ one, many }) => ({
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id],
    }),
    children: many(files), 
}))

// type definition for the files table
export const File = typeof files.$inferSelect 
export const NewFile = typeof files.$inferInsert