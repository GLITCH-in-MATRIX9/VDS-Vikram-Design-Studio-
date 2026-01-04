import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaTrash } from "react-icons/fa";

const ProjectSections = ({
  sections,
  handleAddText,
  handleAddImage,
  handleAddGif,
  handleContentChange,
  handleRemoveContent,
  handleDragEnd,
}) => (
  <div>
    <h2 className="font-bold text-lg mb-2 text-[#454545]">
      3. Project Sections
    </h2>
    <div className="flex gap-2 mb-2">
      <button
        type="button"
        onClick={handleAddText}
        className="px-4 py-2 bg-[#722F37] text-white rounded hover:bg-[#632932] text-sm font-medium"
      >
        Add Text
      </button>
      <label className="px-4 py-2 bg-[#722F37] text-white rounded cursor-pointer hover:bg-[#632932] text-sm font-medium">
        Add Image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleAddImage(e.target.files[0])}
        />
      </label>
      <label className="px-4 py-2 bg-[#722F37] text-white rounded cursor-pointer hover:bg-[#632932] text-sm font-medium">
        Add GIF
        <input
          type="file"
          accept="image/gif"
          
          className="hidden"
          onChange={(e) => handleAddGif(e.target.files[0])}
        />
      </label>
    </div>

    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sections.map((section, index) => (
              <Draggable
                key={index}
                draggableId={`section-${index}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="border rounded p-2 mb-2"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span {...provided.dragHandleProps}>
                        <FaGripVertical />
                      </span>
                      <FaTrash
                        className="cursor-pointer text-red-500"
                        onClick={() => handleRemoveContent(index)}
                      />
                    </div>

                    {section.type === "text" && (
                      <textarea
                        value={section.content}
                        onChange={(e) =>
                          handleContentChange(index, e.target.value)
                        }
                        className="border p-2 rounded w-full"
                        rows={3}
                      />
                    )}
                    {(section.type === "image" || section.type === "gif") && (
                      <img
                        src={section.content}
                        alt={section.type}
                        className="w-auto h-40 object-cover rounded"
                      />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </div>
);

export default ProjectSections;
