package com.ems.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.ems.dto.EmployeeDto;

public interface EmployeeService {

    EmployeeDto saveEmployee(EmployeeDto employeeDto);

    Page<EmployeeDto> getAllEmployees(int page, int size, String sortBy);

    EmployeeDto getEmployeeById(Long id);

    EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto);

    void deleteEmployee(Long id);

    List<EmployeeDto> searchByName(String name);

    List<EmployeeDto> searchByDepartment(String department);
}