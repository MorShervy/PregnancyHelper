


------------------------------------------- טבלאות -------------------------------------------

CREATE TABLE [dbo].[TBUsers](
	[UserID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[FirstName] [nvarchar](30) NULL,
	[LastName] [nvarchar](30) NULL,
	[Email] [nvarchar](50) NOT NULL,
	[PasswordHash] BINARY(64) NOT NULL,
	[Salt] UNIQUEIDENTIFIER,
	[RegistrationDate] [nvarchar](50) NOT NULL,
	)
GO

/*
DROP TABLE [dbo].[TBUsers]
GO
*/

CREATE TABLE [dbo].[TBResetPasswordRequests](
	[ID] uniqueidentifier PRIMARY KEY,
	[UserID] [int] FOREIGN KEY REFERENCES TBUsers([UserID]),
	[ResetRequesteDateTime] datetime
	)
GO

/*
DROP TABLE [dbo].[TBResetPasswordRequests]
GO
*/

CREATE TABLE [dbo].[TBUserPregnancy](
	[PregnantID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[UserID] [int] FOREIGN KEY REFERENCES TBUsers([UserID]),
	[DueDate] date NOT NULL,
	[LastMenstrualPeriod] date NOT NULL,
	[ChildName] [nvarchar](30) NULL,
	[BirthDate] date NULL,
	[Gender] bit NULL,
	[IsNewBorn] bit NULL
	)
GO

/*
DROP TABLE [dbo].[TBUserPregnancy]
GO
*/

CREATE TABLE [dbo].[TBPregnantAlbum](
	[PregnantID] [int] FOREIGN KEY REFERENCES TBUserPregnancy([PregnantID]) NOT NULL PRIMARY KEY, 
	[WeekID] [int] NOT NULL, --primary key
	[PictureUri] nvarchar(max) NOT NULL,
	[PictureName] nvarchar(100) NOT NULL,
	[PicturePath] nvarchar(100) NOT NULL
	)
GO
	
/*
DROP TABLE [dbo].[TBPregnantAlbum]
GO
*/

CREATE TABLE [dbo].[TBPregnantMovie](
	[PregnantID] [int] FOREIGN KEY REFERENCES TBUserPregnancy([PregnantID]) NOT NULL PRIMARY KEY,
	[MovieUri] nvarchar(max) NOT NULL,
	[MovieName] nvarchar(100) NOT NULL,
	[MoviePath] nvarchar(100) NOT NULL
	)
GO

/*
DROP TABLE [dbo].[TBPregnantMovie]
GO
*/


CREATE TABLE [dbo].[TBUserContractionTimer](
	[UserID] [int] FOREIGN KEY REFERENCES TBUsers([UserID]) NOT NULL PRIMARY KEY,
	[ContractionID] [int]  NOT NULL, --primary key
	[StartTime] time(0) NULL,
	[EndTime] time(0) NULL,
	[ContractionLength]	time(0) NULL, -- seconds
	[TimeApart] time(0) NULL, -- seconds
	[Date] date NOT NULL
	)
GO



/*
DROP TABLE [dbo].[TBUserContractionTimer]
GO
*/

CREATE TABLE [dbo].[TBKickTrackerPregnant](
	[PregnantID] [int] FOREIGN KEY REFERENCES TBUserPregnancy([PregnantID]) NOT NULL PRIMARY KEY,
	[Date] date NOT NULL,
	[Length] time(0) NULL,
	[Time] time(0) NULL,
	[Kicks] int NULL
	)
GO

/*
DROP TABLE [dbo].[TBKickTrackerPregnant]
GO
*/

CREATE TABLE [dbo].[TBAdministrator](
	[AdminID] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[IdentityID] nvarchar(9) NOT NULL,
	[Email] nvarchar(50) NOT NULL,
	[Name] nvarchar(30) NOT NULL,
	[PasswordHash] BINARY(64) NOT NULL,
	[Salt] UNIQUEIDENTIFIER,
	)
GO

/*
DROP TABLE [dbo].[TBAdministrator]
GO
*/


------------------------------------------- פרוצדרות -------------------------------------------

------------SP GetUsers------------
ALTER PROC GetUsers
AS
SELECT UserID,FirstName,LastName,Email,RegistrationDate FROM TBUsers

EXEC GetUsers

------------SP Register------------
-- פרוצדורת הרשמה עם שמירת סיסמה מאובטחת   --
ALTER PROC Register (
	@Email nvarchar(50),
	@Password nvarchar(50),
	@RegistrationDate nvarchar(50),
	@DueDate date,
	@LastMenstrualPeriod date
	)
AS
	BEGIN
	DECLARE @salt UNIQUEIDENTIFIER=NEWID() -- משתנה של מזהה מיוחד מאותחל בערך חדש ואקראי --
	DECLARE @user int
	DECLARE @UserID int

	SET @user = (SELECT Email FROM TBUsers WHERE Email = @Email) -- בדיקת אם קיים המייל ושמירת התוצאה   --

	IF(@user IS NULL) -- במידה והמשתמש אינו קיים במערכת --
		BEGIN
			-- הכנסת הנתונים לטבלת המשתמשים  --
			INSERT INTO TBUsers(Email,PasswordHash,Salt,RegistrationDate)
			-- הכנסת הערכים של המשתמש כולל סיסמה מוצפנת ומשורשרת עם המזהה המיוחד לאבטחת מידע --
			VALUES(@Email,HASHBYTES('SHA2_512',@Password+CAST(@salt AS NVARCHAR(36))),@salt,@RegistrationDate)

		-- שמירת קוד משתמש --
		SET @UserID = (SELECT UserID FROM TBUsers WHERE UserID = @@IDENTITY)
		-- יצירת הריון חדש והכנסת ערכים לטבלת הריונות --
		INSERT INTO TBUserPregnancy(UserID, DueDate, LastMenstrualPeriod)
			VALUES(@UserID,@DueDate,@LastMenstrualPeriod)

		-- ערך מוחזר קוד משתמשת --
		SELECT @UserID AS ID
		END
	ELSE -- במידה והמשתמש קיים --
		BEGIN
		-- ערך מוחזר קוד משתמש קיים --
		SELECT -1 AS ID
		END
	END
GO

EXEC Register 'test3@gmail.com','123456','09-04-2019'

------------SP Login------------
ALTER PROC Login (
	@Email nvarchar(50),
	@Password nvarchar(50)
	)
AS
	BEGIN
	DECLARE @UserID int
	IF EXISTS (SELECT TOP 1 UserID FROM TBUsers WHERE Email = @Email)
		BEGIN
		SET @UserID = (SELECT UserID FROM TBUsers WHERE Email = @Email AND PasswordHash =HASHBYTES('SHA2_512',@Password+CAST(Salt AS NVARCHAR(36))))
		IF(@UserID IS NULL)
			SELECT 0 AS ID
		ELSE
			SELECT @UserID AS ID
		END
	ELSE
		SELECT -1 AS ID
	END
GO

exec Login 'test3@gmail.com','123456'

------------SP ResetPasswordRequest------------
-- פרוצדורת בקשת איפוס סיסמה לפי אימייל --
CREATE PROC ResetPasswordRequest (
	@Email nvarchar(50)
	)
AS
	BEGIN
		DECLARE @UserID int

		SELECT @UserID = UserID FROM TBUsers WHERE @Email = Email
		
		IF(@UserID IS NOT NULL) -- במידה והמשתמש קיים --
			BEGIN 
				-- הגדרה והשמה למזהה מיוחד לבקשה --
				DECLARE @GUID uniqueidentifier
				SET @GUID = NEWID()

				-- הכנסה ושמירת נתונים לבקשת המשתמש --
				INSERT INTO TBResetPasswordRequests(ID, UserID,ResetRequesteDateTime)
				VALUES(@GUID,@UserID,GETDATE())
				-- הערך המוחזר קוד, מזהה מיוחד ואימייל --
				SELECT 1 AS ReturnCode , @GUID as UniqueID , @Email as Email
			END
		ELSE -- במידה והמשתש לא קיים --
			BEGIN
				-- הערך המוחזר 0 --
				SELECT 0 AS ReturnCode , NULL as UniqueID , NULL as Email
			END
	END

GO

exec ResetPasswordRequest 'morshervi@gmail.com'

ALTER PROC ResetPassword (
	@uid uniqueidentifier,
	@NewPassword nvarchar(50)
	)
AS
	BEGIN 
		DECLARE @UserID int
		DECLARE @salt UNIQUEIDENTIFIER=NEWID()
		
		SELECT @UserID = UserID
		FROM TBResetPasswordRequests
		WHERE @uid = ID

		IF(@UserID IS NOT NULL)
			BEGIN
				--if uid is exists
				UPDATE TBUsers
				SET PasswordHash = HASHBYTES('SHA2_512',@NewPassword+CAST(@salt AS NVARCHAR(36))),Salt = @salt
				WHERE UserID = @UserID

				DELETE FROM TBResetPasswordRequests
				WHERE ID = @uid

				SELECT 1 AS ReturnCode
			END
		ELSE
			--if uid is not exists
			SELECT 0 AS ReturnCode
	END
GO

exec ResetPassword '8efc0390-e25f-492c-af92-4b3206bb4f34','1q2w3e4r'



------------SP GetUsers------------
ALTER PROC GetPregnancies
AS
SELECT * FROM TBUserPregnancy