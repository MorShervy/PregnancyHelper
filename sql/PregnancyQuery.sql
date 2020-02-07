


------------------------------------------- Tables -------------------------------------------

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
	[Gender] int NULL,
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
	[ContractionID] [int] IDENTITY(1,1)  NOT NULL, --primary key
	[StartTime] time(0) NULL,
	[EndTime] time(0) NULL,
	[ContractionLength]	time(0) NULL, -- seconds
	[TimeApart] time(0) NULL, -- seconds
	[Date] nvarchar(50) NULL
	)
GO



/*
DROP TABLE [dbo].[TBUserContractionTimer]
GO
*/

CREATE TABLE [dbo].[TBKickTrackerPregnant](
	[PregnantID] [int] FOREIGN KEY REFERENCES TBUserPregnancy([PregnantID]) NOT NULL PRIMARY KEY,
	[Date] nvarchar(50) NOT NULL,
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


------------------------------------------- Procedures -------------------------------------------



----------------------------------------
----------- User controller -------------
----------------------------------------

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
		INSERT INTO TBUserPregnancy(UserID, DueDate, LastMenstrualPeriod,Gender)
			VALUES(@UserID,@DueDate,@LastMenstrualPeriod,-1)

		-- ערך מוחזר קוד משתמשת --
		SELECT UserID,Email FROM TBUsers WHERE UserID = @UserID
		END
	ELSE -- במידה והמשתמש קיים --
		BEGIN
		-- ערך מוחזר קוד משתמש קיים --
		SELECT -1 AS UserID
		END
	END
GO

EXEC Register 'test4@gmail.com','12345678','09/04/2019','2020/04/24','2019/07/19'

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
			SELECT 0 AS UserID
		ELSE
			SELECT UserID,Email FROM TBUsers WHERE UserID = @UserID
		END
	ELSE
		SELECT -1 AS UserID
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


------------SP ResetPassword------------
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

----------------------------------------
----------- End User controller ---------
----------------------------------------

---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------

----------------------------------------
------- User Pregnancy controller -------
----------------------------------------

------------SP GetPregnancies------------
ALTER PROC GetPregnancies
AS
SELECT * FROM TBUserPregnancy

------------SP UpdatePregnancyDates------------
ALTER PROC UpdatePregnancyDates(
	@PregnantID int,
	@DueDate date,
	@LastMenstrualPeriod date
	)
	AS
		BEGIN
			IF EXISTS (SELECT * FROM TBUserPregnancy WHERE PregnantID = @PregnantID)
				BEGIN
					UPDATE TBUserPregnancy
					SET DueDate = @DueDate,LastMenstrualPeriod = @LastMenstrualPeriod
					WHERE PregnantID = @PregnantID
					SELECT 1 AS Result
				END
			ELSE
				BEGIN
					SELECT 0 AS Result
				END
		END
GO

EXEC UpdatePregnancyDates 33,'11/12/2020','02/06/2020'


------------SP UpdatePregnancyDates------------
CREATE PROC UpdateChildName(
	@PregnantID int,
	@ChildName nvarchar(50)
	)
	AS 
		BEGIN
			IF EXISTS (SELECT * FROM TBUserPregnancy WHERE PregnantID = @PregnantID)
				BEGIN
					 UPDATE TBUserPregnancy
					SET ChildName = @ChildName
					WHERE PregnantID = @PregnantID
					SELECT 1 AS Result
				END
			ELSE
				BEGIN
					SELECT 0 AS Result
				END
		END
GO

EXEC UpdateChildName 1,null

------------SP UpdatePregnancyDates------------
CREATE PROC UpdateGender(
	@PregnantID int,
	@Gender int
	)
	AS
		BEGIN
			IF EXISTS (SELECT * FROM TBUserPregnancy WHERE PregnantID = @PregnantID)
				BEGIN
					UPDATE TBUserPregnancy
					SET Gender = @Gender
					WHERE PregnantID = @PregnantID
					SELECT 1 AS Result
				END
			ELSE
				BEGIN
					SELECT 0 AS Result
				END
		END
GO

EXEC UpdateGender 1,-1

----------------------------------------
----- End User Pregnancy controller -----
----------------------------------------

---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------

----------------------------------------
------ Pregnancy Album controller -------
----------------------------------------

------------SP GetPregnanciesAlbums------------
CREATE PROC GetPregnanciesAlbums
AS
SELECT * FROM TBPregnantAlbum

------------SP InsertPictureToPregnantAlbum------------
ALTER PROC InsertPictureToPregnantAlbum(
	@PregnantID int,
	@WeekID int,
	@PictureUri nvarchar(MAX)
)
AS
	BEGIN
		INSERT INTO TBPregnantAlbum(PregnantID,WeekID,PictureUri)
				VALUES(@PregnantID,@WeekID,@PictureUri)

		SELECT * FROM TBPregnantAlbum
		WHERE @PregnantID = PregnantID AND @WeekID = WeekID
	END
GO

------------SP UpdatePictureInPregnancyAlbum------------
CREATE PROC UpdatePictureInPregnancyAlbum (
	@PregnantID int,
	@WeekID int,
	@PictureUri nvarchar(max)
 )
AS
	BEGIN
		UPDATE TBPregnantAlbum
		SET PictureUri = @PictureUri
		WHERE PregnantID = @PregnantID AND WeekID = @WeekID

		SELECT * FROM TBPregnantAlbum
		WHERE PregnantID = @PregnantID AND WeekID = @WeekID
	END
GO

------------SP DeletPictureFromPregnancyAlbum------------
ALTER PROC DeletPictureFromPregnancyAlbum(
   @PregnantID int,
   @WeekID int
) 
AS 
  BEGIN
	DECLARE @Row int
	IF EXISTS (SELECT * FROM TBPregnantAlbum WHERE PregnantID = @PregnantID AND WeekID = @WeekID)
		BEGIN
		DELETE	FROM TBPregnantAlbum WHERE   PregnantID = @PregnantID AND WeekID = @WeekID
		SELECT 1 AS Result
		END
	ELSE
		BEGIN
		SELECT 0 AS Result
		END
	
	----
  END
GO

exec DeletPictureFromPregnancyAlbum 9,9
----------------------------------------
---- End Pregnancy Album controller -----
----------------------------------------

---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------

----------------------------------------
----  Contraction controller -----
----------------------------------------

------------SP GetContractions------------
CREATE PROC GetContractions
AS
	SELECT * FROM TBUserContractionTimer
GO

EXEC GetContractions

------------SP InsertContraction------------
ALTER PROC InsertContraction(
 @UserID int,
 @StartTime time(0),
 @EndTime time(0),
 @Length time(0),
 @TimeApart time(0),
 @DateTime nvarchar(50)
 )
 AS
	BEGIN
		IF EXISTS(SELECT * FROM TBUsers WHERE UserID = @UserID)
			BEGIN
				INSERT INTO TBUserContractionTimer(UserID,StartTime,EndTime,ContractionLength,TimeApart,Date)
				VALUES(@UserID,@StartTime,@EndTime,@Length,@TimeApart,@DateTime)

				SELECT * FROM TBUserContractionTimer WHERE UserID = @UserID ---change!!!!
			END
		ELSE
			BEGIN
				SELECT 0 AS Result
			END
	END
GO

EXEC InsertContraction 12,'12:06','12:06','00:00:15','00:01:54','2020-01-15T14:00:39.000Z'

------------SP DeleteContractionsById------------
ALTER PROC DeleteContractionsById(
	@UserID int
	)
	AS
		BEGIN
			IF EXISTS (SELECT * FROM TBUserContractionTimer WHERE UserID = @UserID)
				BEGIN
					DELETE FROM TBUserContractionTimer
					WHERE UserID = @UserID
					SELECT 1 AS Result
				END
			ELSE
				BEGIN
					SELECT 0 AS Result
				END
		END
GO

EXEC DeleteContractionsById 13


----------------------------------------
---- End  Contraction controller -----
----------------------------------------

---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------

----------------------------------------
---- KickTracker controller -----
----------------------------------------

----- SP Get KickTracker Table --------
CREATE PROC GetKickTrackers
AS
	BEGIN
		SELECT * FROM TBKickTrackerPregnant
	END
GO

EXEC GetKickTrackers


------ SP Insert KickTracker  ------
ALTER PROC InsertKickTracker(
	@PregnantId int,
	@Date nvarchar(50),
	@Length time(0),
	@Time time(0),
	@Kicks int
)
AS
	BEGIN
		IF EXISTS(SELECT * FROM TBUserPregnancy WHERE PregnantID = @PregnantId)
			BEGIN
				INSERT INTO		
				TBKickTrackerPregnant(PregnantID,Date,Length,Time,Kicks)
				VALUES(@PregnantId,@Date,@Length,@Time,@Kicks)
				SELECT 1 AS Result
			END
		ELSE
			BEGIN
				SELECT 0 AS Result
			END
	END
GO

EXEC InsertKickTracker 9,'2','01:30:25','20:00:15',10

------ Delete kickTracker by Pr Id ------
CREATE PROC DeleteKickTrackerById(
	@PregnantId int
)
AS
	BEGIN
		IF EXISTS (SELECT * FROM TBKickTrackerPregnant WHERE PregnantID = @PregnantId)
			BEGIN
				DELETE FROM TBKickTrackerPregnant
				WHERE PregnantID = @PregnantId
				SELECT 1 AS Result
			END
		ELSE
			BEGIN
				SELECT 0 AS Result
			END
	END
GO

EXEC DeleteKickTrackerById 9


----------------------------------------
---- End KickTracker controller -----
----------------------------------------