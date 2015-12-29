package io.trillo.example.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Result {
  public static final String SUCCESS = "success";
  public static final String FAILED = "failed";
  public static final String UNKNOWN = "unknown";
  
  private String status = UNKNOWN;
  private String message = null;
  private List<NamedMessage>namedMessages = null;
  private Map<String, Object> props;

  public Result() {

  }

  public Result(String status) {
    this.status = status;
  }

  public Result(String status, String message) {
    this.status = status;
    this.message = message;
  }
  
  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public List<NamedMessage> getNamedMessages() {
    return namedMessages;
  }

  public void addMessage(String name, String message) {
    if (namedMessages == null) {
      namedMessages = new ArrayList<NamedMessage>();
    }
    NamedMessage m = new NamedMessage(name, message);
    namedMessages.add(m);
  }
  
  
  public Map<String, Object> getProps() {
    return props;
  }

  public void setProps(Map<String, Object> props) {
    this.props = props;
  }
  
  public void addProp(String name, Object value) {
    if (props == null) {
      props = new HashMap<String, Object>();
    }
    props.put(name, value);
  }

  public boolean isFailed() {
    return FAILED.equals(status);
  }
  
  public static Result makeResult(String status, String message) {
    Result r = new Result();
    r.setStatus(status);
    r.setMessage(message);
    return r;
  }
  
  public static class NamedMessage {
    private String name;
    private String message;
    public NamedMessage(String name, String message) {
      this.name = name;
      this.message = message;
    }
    public String getName() {
      return name;
    }
    public String getMessage() {
      return message;
    }
    
  }
}
