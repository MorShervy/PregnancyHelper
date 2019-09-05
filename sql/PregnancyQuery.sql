













------------------------------------------- פרוצדרות -------------------------------------------

CREATE PROC GetUsers
AS
SELECT * FROM TBUsers

ALTER PROC Register (
	@Email nvarchar(50),
	@Password nvarchar(50),
	@RegistrationDate nvarchar(50)
)
AS
IF NOT EXISTS (SELECT * FROM TBUsers WHERE Email = @Email)
	BEGIN
		INSERT INTO TBUsers(Email,Password,RegistrationDate)
					VALUES(@Email,@Password,@RegistrationDate)
		SELECT * FROM TBUsers WHERE UserID = @@IDENTITY
	END
GO

EXEC Register 'test3@gmail.com','123456','09-04-2019'