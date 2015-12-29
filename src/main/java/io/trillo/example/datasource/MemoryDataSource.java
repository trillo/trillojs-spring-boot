package io.trillo.example.datasource;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import io.trillo.example.entity.Result;
import io.trillo.example.entity.Task;

/**
 * This class models a sample in-memory data source of Task entity.
 */
public class MemoryDataSource {

  private static MemoryDataSource _memoryDataSource = null;
  private List<Task> taskList;
  private int INITIAL_NUMBER_OF_SAMPLES = 5;
  /**
   * Singleton pattern.
   */
  public static void createInstance() {
    if (_memoryDataSource == null) {
      _memoryDataSource = new MemoryDataSource();
    }
  }
  
  public static MemoryDataSource getInstance() {
    return _memoryDataSource;
  }
  
  private MemoryDataSource() {
    populateWithSampleData();
  }
  
  /**
   * Returns taskList as in memory.
   * @return list of tasks
   */
  public List<Task> getTaskList() {
    return taskList;
  }
  
  /**
   * Add new a new task
   * @param taskName
   * @param priority
   */
  public Result addNewTask(String taskName, String priority) {
    Task task = new Task();
    task.setUid("Task:" + UUID.randomUUID());
    task.setTaskName(taskName);
    task.setPriority(priority);
    taskList.add(task);
    Result result = new Result();
    result.setMessage("Task '" + taskName + "' saved");
    result.setStatus(Result.SUCCESS);
    result.addProp("task", task);
    return result;
  }
  
  /**
   * Marks a task as completed or uncompleted.
   * @param uid - uid of the task to be marked completed (true or false)
   * @param completed - a boolean, 'true' means the task is completed else uncompleted
   */
  public void completeTask(String uid, boolean completed) {
    if (uid == null) {
      throw new RuntimeException("uid can not be null");
    }
    for (Task task : taskList) {
      if (uid.equals(task.getUid())) {
        task.setCompleted(completed);
      }
    }
  }
  
  /**
   * Adds initial sample to taskList.
   */
  private void populateWithSampleData() {
    taskList = new ArrayList<Task>();
    
    for (int i=0; i<INITIAL_NUMBER_OF_SAMPLES; i++) {
      Task task = new Task();
      task.setUid("Task:" + UUID.randomUUID());
      task.setTaskName("Task " + (i+1));
      task.setPriority("P" + ((i % 3) + 1));
      taskList.add(task);
    }
  }
}
