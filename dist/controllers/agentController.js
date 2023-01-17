"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.propertyUpdate = exports.getSingleProperty = exports.getAllAgentProperty = exports.createProperty = exports.agentLogin = exports.updateAgent = void 0;
const utils_1 = require("../Utils/utils");
const agentModel_1 = __importDefault(require("../model/agentModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const propertyModel_1 = __importDefault(require("../model/propertyModel"));
const updateAgent = async (req, res) => {
    try {
        const _id = req.params._id;
        const { name, companyName, address, email, phone, serviceAvailable, coverImage } = req.body;
        const validateResult = utils_1.updateAgentSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const agent = await agentModel_1.default.findOne({ _id });
        if (!agent) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile"
            });
        }
        const updatedAgent = await agentModel_1.default.findOneAndUpdate({ _id }, { name, companyName, address, email, phone, serviceAvailable, coverImage: req.file.path }); //{new:true})
        if (updatedAgent) {
            const agent = await agentModel_1.default.findOne({ _id });
            return res.status(200).json({
                message: "Agent updated successfully",
                agent
            });
        }
        return res.status(400).json({
            message: "Agent Profile not updated"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/agent/update-agent`
        });
    }
};
exports.updateAgent = updateAgent;
const agentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateInput = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const agent = await agentModel_1.default.findOne({ email });
        console.log(agent);
        if (!agent) {
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            });
        }
        if (agent) {
            const validate = await bcryptjs_1.default.compare(password, agent.password);
            if (validate) {
                const token = await (0, utils_1.generateToken)(`${agent._id}`);
                res.cookie(`token`, token);
                return res.status(200).json({
                    message: "Login Successful",
                    role: agent.role,
                    email: agent.email
                });
            }
        }
        return res.status(400).json({
            message: "Invalid Credentials"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/agent/agentLogin"
        });
    }
};
exports.agentLogin = agentLogin;
const createProperty = async (req, res) => {
    try {
        const _id = req.agent._id;
        console.log(_id);
        const { name, description, address, category, image } = req.body;
        // const salt = await GenerateSalt()
        // const agentPassword = await GeneratePassword(password,salt)
        const agent = await agentModel_1.default.findById({ _id }).populate('property');
        // const author = await Author.findById(id).populate('books')
        // const Admin = await User.findOne({_id})
        if (agent) {
            const createProperty = await propertyModel_1.default.create({
                name,
                address,
                description,
                category,
                propertySize: "",
                condition: "",
                price: 0,
                rating: 0,
                agentId: _id,
                image: req.file.path
            });
            agent.property.push(createProperty);
            agent.save();
            return res.status(201).json({
                message: "Property created successfully",
                createProperty
            });
        }
        return res.status(400).json({
            message: "unauthorised access"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            Error: "/agent/create-property"
        });
    }
};
exports.createProperty = createProperty;
const getAllAgentProperty = async (req, res) => {
    try {
        const _id = req.agent._id;
        const properties = await propertyModel_1.default.find({});
        const agent = await agentModel_1.default.findById({ _id });
        if (agent) {
            return res.status(200).json({
                message: "All Properties",
                properties
            });
        }
        return res.status(400).json({
            message: "unauthorised access"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            Error: "/agent/create-property"
        });
    }
};
exports.getAllAgentProperty = getAllAgentProperty;
const getSingleProperty = async (req, res) => {
    try {
        const _id = req.params._id;
        const property = await propertyModel_1.default.findOne({ _id });
        // const agent = await Agent.findById({_id})
        if (property) {
            return res.status(200).json({
                message: "Your Property",
                property
            });
        }
        return res.status(400).json({
            message: "property not found"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            Error: "/agent/create-property"
        });
    }
};
exports.getSingleProperty = getSingleProperty;
const propertyUpdate = async (req, res) => {
    try {
        const id = req.params._id;
        const { name, description, address, category, price, propertySize, condition, image } = req.body;
        const validateResult = utils_1.updatePropertySchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const property = await propertyModel_1.default.findOne({ id });
        if (!property) {
            return res.status(400).json({
                Error: "You are not authorized to update this property",
            });
        }
        const updatedProperty = await propertyModel_1.default.findOneAndUpdate({ id }, {
            name, description, address, category, price, propertySize, condition,
            image: req.file.path
        });
        // console.log(property)
        if (updatedProperty) {
            const propz = await propertyModel_1.default.findOne({ id });
            return res.status(200).json({
                message: 'Property updated',
                propz
            });
        }
        return res.status(400).json({
            message: "Error occurred",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agent/updateProperty/:_id"
        });
    }
};
exports.propertyUpdate = propertyUpdate;
const deleteProperty = async (req, res) => {
    try {
        const id = req.params._id;
        const delProperty = await propertyModel_1.default.findByIdAndDelete({ _id: id });
        const property = await propertyModel_1.default.find({});
        console.log(property);
        if (property) {
            return res.status(200).json({
                message: `Property deleted`,
                property
            });
        }
        return res.status(400).json({
            message: 'Unable to delete'
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: '/agent/delete-property'
        });
    }
};
exports.deleteProperty = deleteProperty;
