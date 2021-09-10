const mongoose = require('../../database/index')

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    createdAt:{
        type: Date, 
        default: Date.now,
    },
},{usePushEach:true});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;