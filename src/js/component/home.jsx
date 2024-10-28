import React, { useState, useEffect } from "react";

const Home = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    checkUser();
  }, []);

  function checkUser() {
    fetch("https://playground.4geeks.com/todo/users?offset=0&limit=100")
      .then((resp) => resp.json())
      .then((data) => {
        const foundUser = data.users.find((item) => item.name === "flodsc");
        if (foundUser) {
          console.log("Usuario encontrado: ", foundUser);
          getTodos();
        } else {
          console.log("Usuario no encontrado: Creando usuario...");
          let newUser = { name: "flodsc" };
          fetch("https://playground.4geeks.com/todo/users/flodsc", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((resp) => resp.json())
            .then((user) => {
              console.log("Usuario creado: ", user);
              getTodos();
            })
            .catch((error) => console.error(error));
        }
      });
  }

  function getTodos() {
    // Obtiene las tareas del usuario
    fetch("https://playground.4geeks.com/todo/users/flodsc")
      .then((resp) => resp.json())
      .then((data) => setTodos(data.todos))
      .catch((error) => console.error(error));
  }

  function addTodo(todoLabel) {
    if (todoLabel !== "") {
      let newTask = {
        label: todoLabel,
        is_done: false,
      };
      // Agregar nueva tarea
      fetch("https://playground.4geeks.com/todo/todos/flodsc", {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((createdTodo) => {
          setTodos((prevTodos) => [...prevTodos, createdTodo]); 
          setTodo(""); // Limpiar el input
        })
        .catch((error) => console.error(error));
    }
  }

  function removeTodo(todoId) {
    // Eliminar tarea
    let updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        console.log("Tarea eliminada: ", resp.status);
      })
      .catch((error) => console.error(error));
  }

  function changeCheckboxStatus(e, todoId) {
    const isChecked = e.target.checked;
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, is_done: isChecked }; // Actualiza el estado de la tarea
      }
      return todo; // Devuelve la tarea original
    });

    setTodos(updatedTodos); 

    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ is_done: isChecked }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Estado de tarea actualizado: ", data);
      })
      .catch((error) => console.error(error));
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo(todo); 
    }
  };

  return (
    <div className="todo-container">
      <h1 className="mytitle">todos</h1>
      <input
        className="form-control"
        placeholder="What needs to be done?"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <ul className="list-group list-group-flush">
        {todos.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={item.is_done}
                  onChange={(e) => changeCheckboxStatus(e, item.id)}
                />
              </div>
              <span className={`ms-2 ${item.is_done ? "text-decoration-line-through" : ""}`}>
                {item.label}
              </span>
            </div>
            <button onClick={() => removeTodo(item.id)} className="btn btn-danger">
              X
            </button>
          </li>
        ))}
      </ul>
      <div className="text-start">
        <span className="ms-2 text-secondary fw-semibold">
          {todos.length < 1
            ? "No hay tareas, añade una tarea"
            : todos.length + " items left"}
        </span>
      </div>
    </div>
  );
};

export default Home;