import { Request, Response } from "express";
import Role from "../models/role.js";

export const createRole = async (req: Request, res: Response) => {
  try {
    const { displayName, name, permissions } = req.body;

    const newRole = new Role({
      displayName,
      name,
      permissions,
    });

    await newRole.save();

    res.status(201).json({
      success: true,
      message: "Role saved successfully",
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find();

    res.status(200).json(roles);
  } catch (error) {
    console.error("Error listing roles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    const role = await Role.findById(roleId);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error("Error retrieving role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateRoleById = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;
    const { displayName, name, permissions } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { displayName, name, permissions },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRoleById = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    const deletedRole = await Role.findByIdAndDelete(roleId);

    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
