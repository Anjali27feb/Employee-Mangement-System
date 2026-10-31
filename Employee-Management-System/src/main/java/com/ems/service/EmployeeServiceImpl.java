package com.ems.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ems.dto.EmployeeDto;
import com.ems.entity.Employee;
import com.ems.exception.EmployeeNotFoundException;
import com.ems.repository.EmployeeRepository;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               ModelMapper modelMapper) {
        this.employeeRepository = employeeRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public EmployeeDto saveEmployee(EmployeeDto employeeDto) {

        Employee employee = modelMapper.map(employeeDto, Employee.class);

        Employee savedEmployee = employeeRepository.save(employee);

        return modelMapper.map(savedEmployee, EmployeeDto.class);
    }

    @Override
    public Page<EmployeeDto> getAllEmployees(int page, int size, String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        Page<Employee> employeePage = employeeRepository.findAll(pageable);

        return employeePage.map(employee ->
                modelMapper.map(employee, EmployeeDto.class));
    }

    @Override
    public EmployeeDto getEmployeeById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee not found with id: " + id));

        return modelMapper.map(employee, EmployeeDto.class);
    }

    @Override
    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee not found with id: " + id));

        existingEmployee.setName(employeeDto.getName());
        existingEmployee.setEmail(employeeDto.getEmail());
        existingEmployee.setDepartment(employeeDto.getDepartment());
        existingEmployee.setSalary(employeeDto.getSalary());

        Employee updatedEmployee = employeeRepository.save(existingEmployee);

        return modelMapper.map(updatedEmployee, EmployeeDto.class);
    }

    @Override
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee not found with id: " + id));

        employeeRepository.delete(employee);
    }

    @Override
    public List<EmployeeDto> searchByName(String name) {

        return employeeRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(employee -> modelMapper.map(employee, EmployeeDto.class))
                .toList();
    }

    @Override
    public List<EmployeeDto> searchByDepartment(String department) {

        return employeeRepository.findByDepartmentContainingIgnoreCase(department)
                .stream()
                .map(employee -> modelMapper.map(employee, EmployeeDto.class))
                .toList();
    }
}