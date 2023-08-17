const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        const initializeModel = require(path.join(__dirname, file));
        const model = initializeModel(sequelize);
        db[model.name] = model;
        console.log(`Processed model: ${model.name}`);
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Set up relationships
if (db.user && db.post) {  // Checking for the existence of the models
    db.user.hasMany(db.post, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    });

    db.user.hasMany(db.post, {
        foreignKey: 'UserName',
        onDelete: 'CASCADE',
    });

    db.post.belongsTo(db.user, {
        foreignKey: 'UserName',
    });
}

module.exports = db;  // Export the entire db object
