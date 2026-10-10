import ApiError from "../api-error.js";
import ContactService from "../service/contact.service.js";
import MongoDB from "../utils/mongodb.util.js"

const create = async (req, res, next) => {
  if (!req.body?.name) return next(new ApiError(400, "Name cannot be empty"));

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.status(201).send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occured while creating the contact"));
  }
};

const findAll = async (req, res, next) => {
  let documents = [];

  try {
    const contacService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contacService.findByName(name);
    } else {
      documents = await contacService.find({});
    }
    return res.status(200).send(documents);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving contacts")
    );
  }
};

const findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error retrieving contact with id=${req.params.id}`));
  }
};

const update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) return next(new ApiError(400, "Data to update can not be empty"));

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was update successfully" });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error updating contact with id=${req.params.id}`));
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Could not delete contact with id= ${req.params.id}`));
  }
};

const deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deleteCount = await contactService.deleteAll();
    return res.send({
      message: `${deleteCount} contacts were deleted successfully`
    });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    );
  }
};

const findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findAllFavorite();
    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while retrieving favorite contacts"));
  }
};

export {
  create, findAll, findOne, findAllFavorite, update, deleteOne, deleteAll
};
