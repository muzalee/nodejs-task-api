module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      title: String,
      description: String,
      dueDate: Date,
      priority: Number,
      isCompleted: { type: Boolean, defaults: false },
      isArchived: { type: Boolean, defaults: false }
    },
    { timestamps: true }
  )

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const Task = mongoose.model('task', schema)
  return Task
}
