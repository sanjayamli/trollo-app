import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../services/api";
import { toast } from "react-toastify";
import Menu from "../components/nav";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const handleShowAddTaskModal = () => {
    setNewTask({ title: "", description: "" }); 
    setShowAddTaskModal(true);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
  };

  const handleAddTask = async () => {
    try {
      const response = await api.post("/tasks", newTask);
      setTasks([...tasks, response.data]);
      toast.success("Task added successfully!");  
      handleCloseAddTaskModal();
    } catch (error) {
      console.error("Failed to add a new task:", error);
      toast.error("Failed to add task!");  
    }
  };

  const columns = ["todo", "in-progress", "done"];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks!"); 
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = columns[destination.droppableId];
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
    try {
      await api.put(`/tasks/${movedTask._id}`, { status: movedTask.status });
      toast.success("Task status updated!"); 
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status!");
    }
  };

  const handleShowModal = (task, mode = "view") => {
    setSelectedTask(task);
    setModalMode(mode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully!");  
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task!"); 
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleEditTask = async () => {
    try {
      const updatedTask = {
        title: selectedTask.title,
        description: selectedTask.description,
      };

      await api.put(`/tasks/${selectedTask._id}`, updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id ? { ...task, ...updatedTask } : task
        )
      );
      toast.success("Task updated successfully!");  
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update the task:", error);
      toast.error("Failed to update task!"); 
    }
  };

  return (
    <>
      <Menu />
      <div className="container my-4">
        <h1 className="text-center text-primary mb-4">Task Manager</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-secondary">Tasks</h2>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Search tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "200px", marginRight: "10px" }}
            />
            <Button variant="primary" onClick={() => handleShowAddTaskModal()}>
              Add Task
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="d-flex  justify-content-between">
            {columns.map((column, colIndex) => (
              <Droppable droppableId={String(colIndex)} key={column}>
                {(provided) => (
                  <div
                    className="column p-3  rounded shadow-sm"
                    style={{ width: "30%" }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <h3 className="text-center bg-primary text-light">
                      {column.toUpperCase()}
                    </h3>
                    {filteredTasks
                      .filter((task) => task.status === column)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="task p-3 mb-2 cards-color rounded shadow-sm "
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h5>{task.title || 'title'}</h5>
                              <p className="text-muted">{task.description || 'description task'}</p>
                              <p className="text-muted">
                                {new Date(task.updatedAt).toLocaleString() || new Date()}
                              </p>
                              <div className="d-flex justify-content-end">
                                <Button
                                  variant="danger"
                                  size="sm me-2"
                                  onClick={() => handleDeleteTask(task._id)}
                                >
                                  Delete
                                </Button>
                                <Button
                                  style={{ background: "#87CEEB" }}
                                  size="sm"
                                  className="me-2 border-0"
                                  onClick={() => handleShowModal(task, "edit")}
                                >
                                  Edit
                                </Button>

                                <Button
                                  variant="primary"
                                  size="sm"
                                  className=""
                                  onClick={() => handleShowModal(task, "view")}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "view" ? "View Task" : "Edit Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <Form>
              <Form.Group controlId="taskTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task title"
                  name="title"
                  value={selectedTask.title}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                />
              </Form.Group>
              <Form.Group controlId="taskDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter task description"
                  name="description"
                  value={selectedTask.description}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {modalMode === "edit" && (
            <Button variant="primary" onClick={handleEditTask}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal show={showAddTaskModal} onHide={handleCloseAddTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newTaskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group controlId="newTaskDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddTaskModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskBoard;
