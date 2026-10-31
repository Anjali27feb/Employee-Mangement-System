package com.ems.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ems.dto.EmployeeDto;
import com.ems.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/employees")
@Tag(
    name = "Employee Controller",
    description = "REST APIs for Employee Management System"
)
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @Operation(summary = "Create a new employee")
    @PostMapping
    public EmployeeDto saveEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
        return employeeService.saveEmployee(employeeDto);
    }

    @Operation(summary = "Get all employees with pagination and sorting")
    @GetMapping
    public Page<EmployeeDto> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        return employeeService.getAllEmployees(page, size, sortBy);
    }

    @Operation(summary = "Get employee by ID")
    @GetMapping("/{id}")
    public EmployeeDto getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @Operation(summary = "Update employee details")
    @PutMapping("/{id}")
    public EmployeeDto updateEmployee(@PathVariable Long id,
                                      @Valid @RequestBody EmployeeDto employeeDto) {
        return employeeService.updateEmployee(id, employeeDto);
    }

    @Operation(summary = "Search employees by name")
    @GetMapping("/search/name")
    public List<EmployeeDto> searchByName(@RequestParam String name) {
        return employeeService.searchByName(name);
    }

    @Operation(summary = "Search employees by department")
    @GetMapping("/search/department")
    public List<EmployeeDto> searchByDepartment(@RequestParam String department) {
        return employeeService.searchByDepartment(department);
    }

    @Operation(summary = "Delete employee")
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return "Employee deleted successfully!";
    }
}