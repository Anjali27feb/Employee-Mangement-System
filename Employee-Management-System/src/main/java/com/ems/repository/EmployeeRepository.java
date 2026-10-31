package com.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ems.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByNameContainingIgnoreCase(String name);

    List<Employee> findByDepartmentContainingIgnoreCase(String department);

}