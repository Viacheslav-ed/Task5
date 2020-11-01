const User = require('./user.model');
const Task = require('../tasks/task.model');

const getAll = async () => User.find({});
const get = async id => {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error(`User '${id}' not found`);
    err.status = '404';
    throw err;
  }
  return user;
};
const getByLogin = async login => User.findOne({ login });
const create = async user => User.create(user);
const update = async (id, user) => {
  await get(id);
  await User.updateOne({ _id: id }, user);
  return get(id);
};
const remove = async id => {
  await get(id);
  await User.deleteOne({ _id: id });
  const userTasks = await Task.find({ userId: id });
  for (const task of userTasks) {
    await Task.updateOne({ _id: task.id }, { userId: null });
  }
};

module.exports = { getAll, get, create, update, remove, getByLogin };
