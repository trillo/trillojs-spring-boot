package io.trillo.example.entity;

/**
 * This class models a to-do list task.
 */
public class Task {
  
  /*
   * Represents uid of the task. It is a string in the following format:
   * <class name>:<uuid>, a random uuid is generated using Java library.
   */
  private String uid;
  
  /*
   * A short description of the task.
   */
  private String taskName;
  
  /*
   * Priority of task.
   */
  private String priority;

  
  /*
   * A flag indicating if the task is completed or not.
   */
  private boolean completed = false;

  
  public String getUid() {
    return uid;
  }


  public void setUid(String uid) {
    this.uid = uid;
  }


  public String getTaskName() {
    return taskName;
  }


  public void setTaskName(String taskName) {
    this.taskName = taskName;
  }


  public String getPriority() {
    return priority;
  }


  public void setPriority(String priority) {
    this.priority = priority;
  }


  public boolean isCompleted() {
    return completed;
  }


  public void setCompleted(boolean completed) {
    this.completed = completed;
  }
  
}
