package io.trillo.example.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import io.trillo.example.datasource.MemoryDataSource;
import io.trillo.example.entity.Result;
import io.trillo.example.entity.Task;

/**
 * Sprint controller class to provide various services to a sample application.
 */
@Controller
public class ToDoController {

  @RequestMapping(value = "/taskList", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody List<Task> getView() {
    return MemoryDataSource.getInstance().getTaskList();
  }
  
  @RequestMapping(value = "newTask", produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody Result newUser(@RequestBody @Valid  Task task, BindingResult bindingRes) {
    return MemoryDataSource.getInstance().addNewTask(task.getTaskName(), task.getPriority());
  }
}
