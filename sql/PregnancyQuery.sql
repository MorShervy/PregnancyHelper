


------------------------------------------- טבלאות -------------------------------------------

CREATE TABLE [dbo].[TBUsers](
	[UserID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[FirstName] [nvarchar](30) NULL,
	[LastName] [nvarchar](30) NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[RegistrationDate] [nvarchar](50) NOT NULL,
	)
GO








------------------------------------------- פרוצדרות -------------------------------------------

CREATE PROC GetUsers
AS
SELECT * FROM TBUsers

EXEC GetUsers

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