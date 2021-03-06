package com.wilson.dao;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wilson.entity.User;

public interface UserDao extends JpaRepository<User,Integer> {
	
	@Query("FROM User WHERE lower(username) = lower(:username) AND password = :password")
	User login(@Param("username")String username, @Param("password")String password);
	
	@Query("FROM User WHERE lower(username) = lower(:username)")
    User findUserByUsername(@Param("username")String username);
	
	@Transactional
	@Modifying
	@Query("UPDATE User u SET u.password = :password WHERE u.id = :id")
	int updatePassword(@Param("password")String password, @Param("id")int id);
	
	@Transactional
	@Modifying
	@Query("UPDATE User u SET u.firstName = :firstName, u.lastName = :lastName, u.email = :email, u.pic = :pic WHERE u.username = :username")
	int updateInformation(@Param("firstName")String firstName, @Param("lastName")String lastName, @Param("email")String email, @Param("pic")byte[] pic, @Param("username")String username);
}
