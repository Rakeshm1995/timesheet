from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser 
# from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
import re
from pytz import timezone
# Create your models here.


class UserManager(BaseUserManager):
    def create_user(self,user_name, name, role=None,password=None,password2=None,):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not user_name:
            raise ValueError("The Username field is required")
        # if email:
        #     email = self.normalize_email(email)
        
        user = self.model(
            user_name=user_name,
            name=name,
            role=role,
    
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_name, name, password=None,):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            user_name=user_name,
            password=password,
            role="Admin",
            name=name,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
# ------------------------------------Admin Register model-------------------------------------
class User(AbstractBaseUser):
    user_name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(verbose_name="Email",max_length=255,unique=True,null=True) 
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=50,default='user')
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    objects = UserManager()
    USERNAME_FIELD = "user_name"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.user_name

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

# -------------------------Custom validator for alphanumeric Employee_code--------------------------
def validate_employee_code(value):
    if not re.match(r'^[A-Za-z0-9]+$', value):
        raise ValidationError("Employee code must be alphanumeric.")


# ------------------------------------Employee Register model-------------------------------------
class Employee(models.Model):
    date = models.DateField()  # Users can enter past or present dates
    zone = models.CharField(max_length=100)
    employee_code = models.CharField(
        max_length=10,
        unique=True,
        validators=[validate_employee_code])
            # RegexValidator(regex=r'^[a-zA-Z0-9]*$', message='Employee code must be alphanumeric')])
    employee_name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    supervisor_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.employee_name} ({self.employee_code})"
    
    
# ------------------------------------Otp store for forget password  model-------------------------------------
class OTP(models.Model):
    email = models.EmailField(max_length=100)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    # def is_valid(self):
    #      return (datetime.now(timezone.utc) - self.created_at).total_seconds() < 600
        # OTP is valid for 10 minutes
        # return (datetime.now() - self.created_at).total_seconds() < 600
        #  return (timezone.now() - self.created_at).total_seconds() < 600



# ------------------------------------Employee Attendance model-------------------------------------
class EmployeeAttendance(models.Model):
    # Fields for the Employee Attendance model
    date_of_work = models.DateField()
    zone = models.CharField(max_length=100)
    employee_code = models.CharField(max_length=10,validators=[validate_employee_code])
    employee_name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    supervisor_name = models.CharField(max_length=100,default="NA")  
    shift=models.CharField(max_length=10,default="NA") 
    # SK, SSK, USK with OT fields that can only be 0 or 1
    sk = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=0)
    sk_ot = models.IntegerField(default=0)
    ssk = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=0)
    ssk_ot = models.IntegerField(default=0)
    usk = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=0)
    usk_ot = models.IntegerField(default=0)

    # Attendance field
    attendance = models.BooleanField(max_length=100)

    def __str__(self):
        return f'{self.employee_name} - {self.employee_code}'

# ------------------------------------JobSetDetails model-------------------------------------
class JobSetDetails(models.Model):
    date = models.DateField()
    zone = models.CharField(max_length=100)
    shift=models.CharField(max_length=10,default="NA")
    supervisor_name = models.CharField(max_length=100)
    low_stub = models.PositiveIntegerField(default=0)
    anode_covering = models.PositiveIntegerField(default=0)
    side_making = models.PositiveIntegerField(default=0)
    hole = models.PositiveIntegerField(default=0)
    house_keeping = models.PositiveIntegerField(default=0)
    supply = models.PositiveIntegerField(default=0)
    # Summary fields
    skilled = models.PositiveIntegerField(default=0)
    semi_skilled = models.PositiveIntegerField(default=0)
    unskilled = models.PositiveIntegerField(default=0)

    def calculate_summary(self):
        self.skilled = (self.low_stub/3)+ (self.hole/1)
        self.semi_skilled = (self.anode_covering/4) + (self.side_making/5) + (self.supply/1)
        self.unskilled = self.house_keeping/1
        self.save()
