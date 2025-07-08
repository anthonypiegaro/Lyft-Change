import { pgEnum, pgTable, primaryKey, text, timestamp, boolean, uuid, unique, date, integer } from "drizzle-orm/pg-core";

export const weightUnitsEnum = pgEnum("weight_units", ["g", "kg", "oz", "lb"])
export const timeUnitsEnum = pgEnum("time_units", ["ms", "s", "m", "h"])
export const distanceUnitsEnum = pgEnum("distance_units", ["mm", "m", "km", "in", "ft", "yd", "mi"])
			
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
});

// Tables above this comment were built by 'Better Auth' for their service

export const exerciseType = pgTable("exercise_type", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique()
})

export const weightRepsDefaultUnits = pgTable("weight_reps_default_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  exerciseId: uuid("exercise_id").notNull().unique().references(() => exercise.id, { onDelete: "cascade" }),
  weightUnit: weightUnitsEnum().notNull()
})

export const timeDistanceDefaultUnits = pgTable("time_distance_default_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  exerciseId: uuid("exercise_id").notNull().unique().references(() => exercise.id, { onDelete: "cascade" }),
  timeUnit: timeUnitsEnum().notNull(),
  distanceUnit: distanceUnitsEnum().notNull()
})

export const exercise = pgTable("exercise", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  typeId: uuid("type_id").notNull().references(() => exerciseType.id),
  name: text("name").notNull(),
  description: text("description"),
  hidden: boolean("hidden").notNull().default(false)
})

export const exerciseTag = pgTable("exercise_tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull()
}, (t) => [
  unique().on(t.userId, t.name)
])

export const exerciseToExerciseTag = pgTable("exercise_to_exercise_tag", {
  exerciseId: uuid("exercise_id").notNull().references(() => exercise.id, { onDelete: "cascade" }),
  exerciseTagId: uuid("exercise_tag_id").notNull().references(() => exerciseTag.id, { onDelete: "cascade" })
}, (t) => [
  primaryKey({ columns: [t.exerciseId, t.exerciseTagId] })
])

export const workout = pgTable("workout", {
  id: uuid("workout").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  notes: text("notes")
})

export const workoutTag = pgTable("workout_tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull()
}, (t) => [
  unique().on(t.userId, t.name)
])

export const workoutToWorkoutTag = pgTable("workout_to_workout_tag", {
  workoutId: uuid("workout_id").notNull().references(() => workout.id, { onDelete: "cascade" }),
  workoutTagId: uuid("workout_tag_id").notNull().references(() => workoutTag.id, { onDelete: "cascade" })
}, (t) => [
  primaryKey({ columns: [t.workoutId, t.workoutTagId] })
])

export const workoutInstance = pgTable("workout_instance", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  notes: text("notes"),
  date: date("date").notNull()
})

export const exerciseTemplate = pgTable("exercise_template", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id").notNull().references(() => exercise.id, { onDelete: "cascade" }),
  workoutId: uuid("workout_id").notNull().references(() => workout.id, { onDelete: "cascade" }),
  notes: text("notes"),
  orderNumber: integer("order_number").notNull()
})

export const exerciseInstance = pgTable("exercise_instance", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id").notNull().references(() => exercise.id, { onDelete: "cascade" }),
  workoutInstanceId: uuid("workout_instance_id").notNull().references(() => workoutInstance.id, { onDelete: "cascade" }),
  notes: text("notes"),
  orderNumber: integer("order_number").notNull()
})

export const setTemplate = pgTable("set_template", {
  id: uuid("id").primaryKey().defaultRandom(),
  exerciseTemplateId: uuid("exercise_template_id").notNull().references(() => exerciseTemplate.id, { onDelete: "cascade" }),
  orderNumber: integer("order_number").notNull()
})

export const setInstance = pgTable("set_instance", {
  id: uuid("id").primaryKey().defaultRandom(),
  exerciseInstanceId: uuid("exercise_instance_id").notNull().references(() => exerciseInstance.id, { onDelete: "cascade" }),
  orderNumber: integer("order_number").notNull(),
  completed: boolean("completed").notNull().default(false)
})

export const weightRepsTemplate = pgTable("weight_reps_template", {
  id: uuid("id").primaryKey().defaultRandom(),
  setTemplateId: uuid("set_template_id").notNull().references(() => setTemplate.id, { onDelete: "cascade" }),
  weight: integer("weight").notNull(),
  reps: integer("reps").notNull(),
  weightUnit: weightUnitsEnum().notNull()
})

export const weightRepsInstance = pgTable("weight_reps_instance", {
  id: uuid("id").primaryKey().defaultRandom(),
  setInstanceId: uuid("set_instance_id").notNull().references(() => setInstance.id, { onDelete: "cascade" }),
  weight: integer("weight").notNull(),
  reps: integer("reps").notNull(),
  weightUnit: weightUnitsEnum().notNull()
})

export const timeDistanceTemplate = pgTable("time_distance_template", {
  id: uuid("id").primaryKey().defaultRandom(),
  setTemplateId: uuid("set_template_id").notNull().references(() => setTemplate.id, { onDelete: "cascade" }),
  time: integer("time").notNull(),
  distance: integer("distance").notNull(),
  timeUnit: timeUnitsEnum().notNull(),
  distanceUnit: distanceUnitsEnum().notNull()
})

export const timeDistanceInstance = pgTable("time_distance_instance", {
  id: uuid("id").primaryKey().defaultRandom(),
  setInstanceId: uuid("set_instance_id").notNull().references(() => setInstance.id, { onDelete: "cascade" }),
  time: integer("time").notNull(),
  distance: integer("distance").notNull(),
  timeUnit: timeUnitsEnum().notNull(),
  distanceUnit: distanceUnitsEnum().notNull()
})

export const program = pgTable("program", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  descritpion: text("description")
})

export const programTag = pgTable("program_tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull()
}, (t) => [
  unique().on(t.userId, t.name)
])

export const programToProgramTag = pgTable("program_to_program_tag", {
  programId: uuid("program_id").notNull().references(() => program.id, { onDelete: "cascade" }),
  programTagId: uuid("program_tag_id").notNull().references(() => programTag.id, { onDelete: "cascade" })
}, (t) => [
  primaryKey({ columns: [t.programId, t.programTagId]})
])

export const programWorkout = pgTable("program_workout", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id").notNull().references(() => program.id, { onDelete: "cascade" }),
  workoutId: uuid("workout_id").notNull().references(() => workout.id, { onDelete: "cascade" }),
  day: integer("day").notNull()
})

export const schema = {
  user,
  session,
  account,
  verification,
  // Tables above this comment were built by 'Better Auth' for their service
  exerciseType,
  exercise,
  exerciseTag,
  exerciseToExerciseTag,
  workout,
  workoutTag,
  workoutToWorkoutTag,
  workoutInstance,
  exerciseTemplate,
  exerciseInstance,
  setTemplate,
  setInstance,
  weightRepsTemplate,
  weightRepsInstance,
  timeDistanceTemplate,
  timeDistanceInstance,
  program,
  programTag,
  programToProgramTag,
  programWorkout
};