import { useState } from "react";
import { task } from "../../types";

interface AddTaskModalProps {
  onTaskAdd: (task: task) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  onTaskAdd
}) => {

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState<task>({
    id: "",
    title: "",
    description: "",
    state: ""
  });

  // TODO para quando os botões forem adicionados as listas
  // const [selectedList, setSelectedList] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.state) {
      onTaskAdd(newTask);
      setShowModal(false);
      setNewTask({
        id: "",
        title: "",
        description: "",
        state: "",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const btnSt = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
  const btnWSt = 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
  const inputSt = 'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
  const Label = (props: { children: string }) => <label className="block text-gray-700 text-sm font-bold mb-2">{props.children}</label>

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowModal(true)}
      >
        Add Task
      </button>

      {showModal && (
        <section className="fixed inset-0 flex items-center justify-center z-50">

          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="bg-white p-4 rounded shadow-md z-50">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Task</h2>
            <form onSubmit={handleFormSubmit}>
              <fieldset className="mb-4">
                <Label>Título:</Label>
                <input
                  className={inputSt}
                  type="text"
                  name="title"
                  value={newTask.title}
                  required
                  onChange={handleInputChange}
                />
              </fieldset>
              <fieldset className="mb-4">
                <Label>Description</Label>
                <textarea
                  className={inputSt}
                  name="description"
                  value={newTask.description}
                  required
                  onChange={handleInputChange}
                />
              </fieldset>
              <fieldset className="mb-4">
                <Label>Status:</Label>
                <select
                  className={inputSt}
                  name="state"
                  value={newTask.state}
                  required
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  <option value="todo">To do</option>
                  <option value="inprogres">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </fieldset>
              <button className={btnSt + ' mr-3'} type="submit">Add</button>
              <button className={btnWSt} onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default AddTaskModal;
