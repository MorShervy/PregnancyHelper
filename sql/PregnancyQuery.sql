


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

CREATE TABLE [dbo].[TBResetPasswordRequests](
	[ID] uniqueidentifier PRIMARY KEY,
	[UserID] [int] FOREIGN KEY REFERENCES TBUsers([UserID]),
	[ResetRequesteDateTime] datetime
	)
GO








------------------------------------------- פרוצדרות -------------------------------------------

------------SP GetUsers------------
CREATE PROC GetUsers
AS
SELECT * FROM TBUsers

EXEC GetUsers

------------SP Register------------
CREATE PROC Register (
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

------------SP ResetPassword------------
CREATE PROC ResetPassword (
	@Email nvarchar(50)
	)
AS
	BEGIN
		DECLARE @UserID int

		SELECT @UserID = UserID
		FROM TBUsers
		WHERE @Email = Email
		
		IF(@UserID IS NOT NULL)
			BEGIN 
				--if email exists
				DECLARE @GUID uniqueidentifier
				SET @GUID = NEWID()

				INSERT INTO TBResetPasswordRequests(ID, UserID,ResetRequesteDateTime)
				VALUES(@GUID,@UserID,GETDATE())
				SELECT 1 AS ReturnCode , @GUID as UniqueID , @Email as Email
			END
		ELSE
			BEGIN
				--if email does not exists
				SELECT 0 AS ReturnCode , NULL as UniqueID , NULL as Email
			END
	END

GO

exec ResetPassword 'morshervi@gmail.com'