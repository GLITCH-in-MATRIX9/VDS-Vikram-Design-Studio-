import React, { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaTrash } from "react-icons/fa";

const AddProject = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        year: "",
        status: "",
        category: "",
        subCategory: "",
        client: "",
        collaborators: "",
        team: "",
        tags: ["", "", ""],
        dateCreated: "",
        dateModified: "",
        modifiedBy: "",
        keyDate: "",
        projectTeam: "",
        preview: null,
    });

    const [blocks, setBlocks] = useState([{ contents: [] }]);
    const fileInputRefs = useRef({});


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("tag")) {
            const index = parseInt(name.split("-")[1], 10);
            const newTags = [...formData.tags];
            newTags[index] = value;
            setFormData((prev) => ({ ...prev, tags: newTags }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleAddBlock = () => {
        setBlocks((prev) => {

            const lastBlock = prev[prev.length - 1];
            if (lastBlock && lastBlock.contents.length === 0) {
                return prev;
            }
            return [...prev, { contents: [] }];
        });
    };
    const handleRemoveBlock = (blockIndex) =>
        setBlocks((prev) => prev.filter((_, i) => i !== blockIndex));


    const handleAddText = (blockIndex) => {
        setBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[blockIndex].contents.push({ type: "text", value: "" });
            return newBlocks;
        });
    };

    const handleAddImage = (blockIndex, file) => {
        if (!file) return;
        setBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[blockIndex].contents.push({
                type: "image",
                value: URL.createObjectURL(file),
            });
            return newBlocks;
        });
    };

    const handleAddGif = (blockIndex, file) => {
        if (!file) return;
        setBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[blockIndex].contents.push({
                type: "gif",
                value: URL.createObjectURL(file),
            });
            return newBlocks;
        });
    };


    const handleContentChange = (blockIndex, contentIndex, value) => {
        setBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[blockIndex].contents[contentIndex].value = value;
            return newBlocks;
        });
    };

    const handleRemoveContent = (blockIndex, contentIndex) => {
        setBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[blockIndex].contents = newBlocks[blockIndex].contents.filter(
                (_, i) => i !== contentIndex
            );
            return newBlocks;
        });
    };


    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === "block") {
            const reordered = Array.from(blocks);
            const [removed] = reordered.splice(source.index, 1);
            reordered.splice(destination.index, 0, removed);
            setBlocks(reordered);
        } else if (type === "content") {
            const sourceBlockIndex = parseInt(source.droppableId.split("-")[1], 10);
            const destBlockIndex = parseInt(destination.droppableId.split("-")[1], 10);

            const sourceContents = Array.from(blocks[sourceBlockIndex].contents);
            const [removed] = sourceContents.splice(source.index, 1);

            if (sourceBlockIndex === destBlockIndex) {
                sourceContents.splice(destination.index, 0, removed);
                setBlocks((prev) => {
                    const newBlocks = [...prev];
                    newBlocks[sourceBlockIndex].contents = sourceContents;
                    return newBlocks;
                });
            } else {
                const destContents = Array.from(blocks[destBlockIndex].contents);
                destContents.splice(destination.index, 0, removed);
                setBlocks((prev) => {
                    const newBlocks = [...prev];
                    newBlocks[sourceBlockIndex].contents = sourceContents;
                    newBlocks[destBlockIndex].contents = destContents;
                    return newBlocks;
                });
            }
        }
    };

    const handlePreviewChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            preview: e.target.files[0],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        console.log("Blocks:", blocks);
    };

    return (
        <div className="flex-1 h-[calc(100vh-100px)] p-6 bg-[#F5F1EE]">
            <nav className="text-sm font-medium mb-4 text-[#722F37]">
                <span>Projects</span> &gt; <span>Add Project</span>
            </nav>

            <form
                onSubmit={handleSubmit}
                className="bg-white border rounded p-6 flex flex-col gap-6"
            >

                <div className="grid grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col gap-4">
                        <h2 className="font-bold text-lg text-[#722F37]">
                            1. Mandatory Fields
                        </h2>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Project Name *"
                            className="border p-2 rounded w-full border-[#C9BEB8]"
                            required
                        />
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="border p-2 rounded w-full border-[#C9BEB8]"
                            required
                        >
                            <option value="">Select State/UT *</option>
                            <option value="State1">State1</option>
                            <option value="State2">State2</option>
                            <option value="UT1">UT1</option>
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Category *"
                                className="border p-2 rounded w-full border-[#C9BEB8]"
                                required
                            />
                            <input
                                type="date"
                                name="keyDate"
                                value={formData.keyDate}
                                onChange={handleChange}
                                className="border p-2 rounded w-full border-[#C9BEB8]"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            placeholder="Client *"
                            className="border p-2 rounded w-full border-[#C9BEB8]"
                            required
                        />
                        <input
                            type="text"
                            name="projectTeam"
                            value={formData.projectTeam}
                            onChange={handleChange}
                            placeholder="Project Team *"
                            className="border p-2 rounded w-full border-[#C9BEB8]"
                            required
                        />
                        <input
                            type="text"
                            name="collaborators"
                            value={formData.collaborators}
                            onChange={handleChange}
                            placeholder="Collaborators *"
                            className="border p-2 rounded w-full border-[#C9BEB8]"
                            required
                        />
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border p-2 rounded w-full border-[#C9BEB8]"
                            required
                        >
                            <option value="">Select Status *</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                    </div>


                    <div className="flex flex-col gap-2 items-center justify-center border p-4 rounded border-[#C9BEB8]">
                        <label className="text-sm font-medium text-[#722F37]">
                            Upload Preview
                        </label>
                        <input type="file" accept="image/*,.gif" onChange={handlePreviewChange} />
                        {formData.preview && (
                            <img
                                src={URL.createObjectURL(formData.preview)}
                                alt="Preview"
                                className="w-auto h-68 object-cover rounded mt-2"
                            />
                        )}
                    </div>
                </div>


                <div className="mt-6">
                    <h2 className="font-bold text-lg mb-4 text-[#722F37]">
                        2. Content Blocks
                    </h2>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="blocks" type="block">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {blocks.map((block, blockIndex) => (
                                        <Draggable
                                            key={`block-${blockIndex}`}
                                            draggableId={`block-${blockIndex}`}
                                            index={blockIndex}
                                        >
                                            {(provided) => (
                                                <div
                                                    className="mb-6 border rounded p-4 border-[#C9BEB8] bg-white"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="font-semibold text-[#722F37]">
                                                            Block {blockIndex + 1}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAddText(blockIndex)}
                                                                className="px-2 py-1 text-sm rounded bg-[#722F37] text-white"
                                                            >
                                                                + Add Text
                                                            </button>
                                                            <label className="px-2 py-1 text-sm rounded bg-green-600 text-white cursor-pointer">
                                                                + Add Image
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) =>
                                                                        handleAddImage(blockIndex, e.target.files[0])
                                                                    }
                                                                />
                                                            </label>
                                                            <label className="px-2 py-1 text-sm rounded bg-purple-600 text-white cursor-pointer">
                                                                + Add GIF
                                                                <input
                                                                    type="file"
                                                                    accept=".gif,image/gif"
                                                                    className="hidden"
                                                                    onChange={(e) =>
                                                                        handleAddGif(blockIndex, e.target.files[0])
                                                                    }
                                                                />
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveBlock(blockIndex)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                            <span
                                                                {...provided.dragHandleProps}
                                                                className="cursor-move text-gray-400 ml-2"
                                                            >
                                                                <FaGripVertical />
                                                            </span>
                                                        </div>
                                                    </div>


                                                    <Droppable
                                                        droppableId={`contents-${blockIndex}`}
                                                        type="content"
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.droppableProps}
                                                                className="flex flex-col gap-2"
                                                            >
                                                                {block.contents.map((content, contentIndex) => (
                                                                    <Draggable
                                                                        key={`content-${blockIndex}-${contentIndex}`}
                                                                        draggableId={`content-${blockIndex}-${contentIndex}`}
                                                                        index={contentIndex}
                                                                    >
                                                                        {(provided) => (
                                                                            <div
                                                                                className="flex items-center gap-2 border p-2 rounded border-[#D9D2CC] bg-[#FAF8F6]"
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                            >
                                                                                <span
                                                                                    {...provided.dragHandleProps}
                                                                                    className="cursor-move text-gray-400"
                                                                                >
                                                                                    <FaGripVertical />
                                                                                </span>
                                                                                {content.type === "text" ? (
                                                                                    <textarea
                                                                                        className="flex-grow border p-2 rounded border-[#C9BEB8]"
                                                                                        value={content.value}
                                                                                        placeholder="Enter text"
                                                                                        onChange={(e) =>
                                                                                            handleContentChange(
                                                                                                blockIndex,
                                                                                                contentIndex,
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                ) : content.type === "image" ? (
                                                                                    <img
                                                                                        src={content.value}
                                                                                        alt="block content"
                                                                                        className="h-20 rounded"
                                                                                    />
                                                                                ) : (
                                                                                    <img
                                                                                        src={content.value}
                                                                                        alt="GIF content"
                                                                                        className="h-20 rounded"
                                                                                    />
                                                                                )}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        handleRemoveContent(
                                                                                            blockIndex,
                                                                                            contentIndex
                                                                                        )
                                                                                    }
                                                                                    className="text-red-600 hover:text-red-800"
                                                                                >
                                                                                    <FaTrash />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <button
                        type="button"
                        onClick={handleAddBlock}
                        className="mt-4 px-4 py-2 bg-[#722F37] text-white rounded"
                    >
                        + Add Block
                    </button>
                </div>

                <button
                    type="submit"
                    className="bg-[#722F37] text-white px-4 py-2 rounded w-32 self-end mt-6"
                >
                    Save Project
                </button>
            </form>
        </div>
    );
};

export default AddProject;
