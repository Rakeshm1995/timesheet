           
# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import UserRegisterSerializer,UserLoginSerializer,ProfileSerializer,UserPasswordChangeSerializer,EmployeeSerializer,EmployeeSearchSerializer,UserPasswordResetSerializer,ForgotPasswordSerializer,EmployeeAttendanceSerializer,TokenRefreshSerializer,EmployeeAttendanceSearchSerializer,JobSetDetailsSerializer
from django.contrib.auth import authenticate
from .renderers import UserRenderer
# from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import get_object_or_404
from .models import Employee,EmployeeAttendance,JobSetDetails
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken  
from django.db.models import Sum, Count, Case, When, IntegerField
from datetime import datetime
from rest_framework.decorators import api_view
from datetime import date
# from .settings import api_settings

# Create your views here.

# ----------------------for token generation-----------------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# ---------------------------Admin or User Registration view----------------------------
class UserRegisterView(APIView):
    renderer_classes=[UserRenderer]
    def post(self,request,format=None):
        serializer=UserRegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user= serializer.save()
            return Response({'msg' : "Register Successfull"},status=status.HTTP_201_CREATED) 
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

#---------------------------------Admin or User Login View--------------------------------- 
class UserLoginView(APIView):
    renderer_classes=[UserRenderer]
    def post(self,request,format=None):
        serializer= UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user_name=serializer.data.get('user_name')
            password=serializer.data.get('password')
            user = authenticate(user_name=user_name,password=password)
            if user is not None:
                response_data = {
                'name': user.name,
                'user_name': user.user_name,
                'role':user.role,
                'is_admin': user.is_admin}
                token= get_tokens_for_user(user)
                return Response({'msg' : "Login Successfull",'user':response_data,'Token':token},status=status.HTTP_200_OK)
            else:
                return Response({'Errors' : {'non_fields_errors':['Username or Password is not valid']}},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
#---------------------Get Access Tokemn using Refresh Token view------------------------------
class TokenRefreshView(APIView):
    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        if serializer.is_valid():
            refresh_token = serializer.validated_data["refresh_token"]
            try:
                refresh = RefreshToken(refresh_token)
                access_token = refresh.access_token
                return Response({"access_token": str(access_token)}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#--------------------- User Data fetching using Access Tokemn view------------------------------
class UserProfileView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated] 
    def post(self,request,format=None):
        serializer=ProfileSerializer(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
# ------------------- User password change View-----------------------------------------
class UserPasswordChangeView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request,format=None):
        serializer=UserPasswordChangeSerializer(data=request.data,context={'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg' : "Password Changed Successfully"},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# -------------------OTP send for User password Forget View-----------------------------------------
class SendOTPView(APIView):
    def post(self, request, format=None):
        serializer = UserPasswordResetSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg': 'OTP sent to your email.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------OTP validation for User password Forget View-----------------------------------------
class ResetPasswordView(APIView):
    def post(self, request, format=None):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --------------------------- New EmployeeRegistration view----------------------------
class EmployeeRegisterView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request,format=None):
        serializer=EmployeeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user= serializer.save()
            return Response({'msg' : "Employee Register Successfull"},status=status.HTTP_201_CREATED) 
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
# -------------------------- Employee Delete and update view----------------------------    
class EmployeeDeleteview(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    # -----------------------------Employee data Delete functions------------------------------
    def delete(self, request, employee_code):
        employee = get_object_or_404(Employee, employee_code=employee_code)
        employee.delete()
        return Response({"message": "Employee deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    # -----------------------------Employee data Update functions------------------------------
    def put(self, request, employee_code):
        employee = get_object_or_404(Employee, employee_code=employee_code)
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ------------------------------- Employee Search view ----------------------------
class EmployeeSearchView(APIView):
    permission_classes=[IsAuthenticated]
    renderer_classes=[UserRenderer]
   
    def post(self, request, *args, **kwargs):
        serializer = EmployeeSearchSerializer(data=request.data)
        if serializer.is_valid():
            # Extract the validated data
            employee_code = serializer.validated_data.get('employee_code', None)
            zone = serializer.validated_data.get('zone', None)
            supervisor_name = serializer.validated_data.get('supervisor_name', None)
            employee_name = serializer.validated_data.get('employee_name', None)
            date = serializer.validated_data.get('date', None)

            # Check if the zone is "ALL"
            if zone and zone.upper() == "ALL":
                employees = Employee.objects.all()
            else:
                # Construct the query with filters
                query = Q()
                if employee_code:
                    query &= Q(employee_code__icontains=employee_code)
                if zone:
                    query &= Q(zone__icontains=zone)
                if supervisor_name:
                    query &= Q(supervisor_name__icontains=supervisor_name)
                if employee_name:
                    query &= Q(employee_name__icontains=employee_name)
                if date:
                    query &= Q(date=date)

                # Query the database
                employees = Employee.objects.filter(query)

            # Return results
            if employees.exists():
                # Serialize the result
                employee_serializer = EmployeeSerializer(employees, many=True)
                return Response(employee_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"msg": "No employees found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --------------------------- Employee Attendace entry view----------------------------
class EmployeeAttendanceAPIView(APIView):
    # permission_classes=[IsAuthenticated]
    renderer_classes=[UserRenderer]
    
    def post(self,request, *args, **kwargs):
        serializer=EmployeeAttendanceSerializer(data=request.data,many=True)
        if serializer.is_valid(raise_exception=True):
            user= serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


# class EmployeeAttendanceView(APIView):
#     def post(self, request):
#         serializer = EmployeeAttendanceSerializer(data=request.data)
#         if serializer.is_valid():  
#             serializer.save()
#             return Response(
#                 {"message": "Attendance recorded successfully."},
#                 status=status.HTTP_201_CREATED 
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------------- Employee Attendance Search view----------------------------
class EmployeeAttendanceSearchView(APIView):
    permission_classes=[IsAuthenticated]
    renderer_classes=[UserRenderer]
   
    def post(self, request, *args, **kwargs):
        serializer = EmployeeAttendanceSearchSerializer(data=request.data)
        if serializer.is_valid():
            # Extract the validated data
            employee_code = serializer.validated_data.get('employee_code', None)
            supervisor_name = serializer.validated_data.get('supervisor_name', None)
            date_of_work= serializer.validated_data.get('date_of_work', None)

            # Construct the query with filters
            query = Q()
            if employee_code:
                query &= Q(employee_code__icontains=employee_code)
            if supervisor_name:
                query &= Q(supervisor_name__icontains=supervisor_name)
            if date_of_work:
                query &= Q(date_of_work=date_of_work)

            # Query the database
            employees = EmployeeAttendance.objects.filter(query)
            
            if employees.exists():
                # Serialize the result
                employee_serializer = EmployeeAttendanceSerializer(employees, many=True)
                return Response(employee_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"msg": "No employees found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# -------------------------- Attendance update view----------------------------    
class AttendanceUpdateview(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def put(self, request, date_of_work, employee_code):
        try:
            # Retrieve the attendance record by date_of_work and employee_code
            attendance = EmployeeAttendance.objects.get(
                date_of_work=date_of_work,
                employee_code=employee_code
            )
        except EmployeeAttendance.DoesNotExist:
            return Response(
                {"error": "Attendance record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize and validate the data for updates
        serializer = EmployeeAttendanceSerializer(attendance, data=request.data, partial=True)

        if serializer.is_valid():
            # Check for duplicates explicitly before saving
            for field in ['date_of_work', 'employee_code']:
                if (
                    EmployeeAttendance.objects.exclude(id=attendance.id)
                    .filter(
                        employee_code=serializer.validated_data.get("employee_code", employee_code),
                        date_of_work=serializer.validated_data.get("date_of_work", date_of_work),
                    )
                    .exists()
                ):
                    return Response(
                        {"error": "Updating the record will result in a duplicate entry."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # Save the validated data
            serializer.save()
            return Response(
                {"message": "Attendance updated successfully.", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # -----------------------------Employee data Update functions------------------------------
    # def put(self, request, employee_code, date_of_work):
    #     # Fetch the employee attendance record for a particular employee on a particular date
    #     employee_attendance = get_object_or_404(EmployeeAttendance, employee_code=employee_code, date_of_work=date_of_work)
    #     # Serialize the employee attendance data with the new data passed in the request
    #     serializer = EmployeeAttendanceSerializer(employee_attendance, data=request.data)

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({
    #             'msg': "Attendance updated successfully",
    #             'data': serializer.data
    #         }, status=status.HTTP_200_OK)
    #     # If the request data is not valid, return the validation errors
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
# ---------------------------User logout  view----------------------------
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes=[UserRenderer]
    def post(self, request):
        try:
            # Get the refresh token from the request data
            refresh_token = request.data.get("refresh_token")
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful, token blacklisted"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# ---------------------------------------- Employee Attendance  all report views--------------------------------------
class EmployeeAttendanceSearchAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes=[UserRenderer]
    def post(self, request, *args, **kwargs):
        # Extracting the data from the request
        supervisor_name = request.data.get("supervisor_name")
        employee_code = request.data.get("employee_code")
        from_date = request.data.get("from_date")
        to_date = request.data.get("to_date")
        
         # Validate date inputs
        if not from_date or not to_date:
            return Response({"error": "Both from_date and to_date are required."}, status=status.HTTP_400_BAD_REQUEST)
        # Validate date inputs
        try:
            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure at least one of supervisor_name or employee_code is provided
        if not supervisor_name and not employee_code and not from_date and not to_date:
            return Response({"error": "Either supervisor_name or employee_code must be provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Build the query based on provided filters
        query = Q(date_of_work__range=(from_date, to_date))
        if supervisor_name:
            query &= Q(supervisor_name__icontains=supervisor_name)
        if employee_code:
            query &= Q(employee_code__icontains=employee_code)
        # Querying the database
        attendance_records = EmployeeAttendance.objects.filter(query)
            # date_of_work__range=(from_date, to_date),
            # supervisor_name=supervisor_name

         # If records exist, serialize and return them
        if attendance_records.exists():
            serializer = EmployeeAttendanceSerializer(attendance_records, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No attendance records found for the given criteria."}, status=status.HTTP_404_NOT_FOUND)

# ---------------------------------------- Employee Attendance monthly report views--------------------------------------
class AttendanceReport(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def post(self, request):
        supervisor_name = request.data.get('supervisor_name')
        from_date = request.data.get('from_date')
        to_date = request.data.get('to_date')

        # Check for missing parameters
        if not supervisor_name or not from_date or not to_date:
            return Response({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

        # Parse the date strings
        try:
            from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
            to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter attendance records based on supervisor name and date range
        attendance_records = EmployeeAttendance.objects.filter(
            supervisor_name__icontains=supervisor_name,  # Use icontains for case-insensitive filtering
            date_of_work__range=[from_date, to_date]
        ).values('zone', 'employee_code', 'employee_name', 'department', 'category', 'supervisor_name') \
        .annotate(
            sk=Sum('sk'), sk_ot=Sum('sk_ot'),
            ssk=Sum('ssk'), ssk_ot=Sum('ssk_ot'),
            usk=Sum('usk'), usk_ot=Sum('usk_ot'),
            attendance=Sum(Case(
                    When(attendance=True, then=1),
                    default=0,
                    output_field=IntegerField()
                ))
        )

        # If records exist, return the grouped data
        if attendance_records:
            month_year = from_date.strftime('%B %Y')  # Format date to get month-year
            data = {
                "month": month_year,
                "records": list(attendance_records)  # Convert queryset to list to be serialized
            }
            return Response(data, status=status.HTTP_200_OK)

        # Return 404 if no records found
        return Response({"message": "No records found"}, status=status.HTTP_404_NOT_FOUND)


# ----------------------------------calculate the all employees per SK, SSK, UK ---------------------------------------
class TimeSheetCalculate(APIView):
    permission_classes = [IsAuthenticated]
    # renderer_classes = [UserRenderer]
    def post(self, request):
        supervisor_name = request.data.get('supervisor_name')
        from_date = request.data.get('from_date')
        to_date = request.data.get('to_date')

        # Check for missing parameters
        if not supervisor_name or not from_date or not to_date:
            return Response({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

        # Parse the date strings
        try:
            from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
            to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter attendance records based on supervisor name and date range
        attendance_records = EmployeeAttendance.objects.filter(
            supervisor_name__icontains=supervisor_name,  # Use icontains for case-insensitive filtering
            date_of_work__range=[from_date, to_date]
        ).values('date_of_work') \
        .annotate(
            total_sk=Sum('sk'),
            total_ssk=Sum('ssk'),
            total_usk=Sum('usk')    
        )

        # If records exist, return the grouped data
        if attendance_records:
            data = {
                "records": [
                    {
                        "date": record['date_of_work'],
                        "total_sk": record['total_sk'],
                        "total_ssk": record['total_ssk'],
                        "total_usk": record['total_usk']
                    } for record in attendance_records
                ]
            }
            return Response(data, status=status.HTTP_200_OK)

        # Return 404 if no records found
        return Response({"message": "No records found"}, status=status.HTTP_404_NOT_FOUND)


# -------------------------- JobSetDetails view----------------------------    
class JobSetDetailsAPIView(APIView):
    # permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]
    def post(self, request):
        serializer = JobSetDetailsSerializer(data=request.data)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------- JobSetTimesheet view----------------------------
class TimeSheetJobSheet(APIView):
    # permission_classes = [IsAuthenticated]
    # renderer_classes = [UserRenderer]
    # def post(self, request):
    #     # Extract parameters from the request
    #     supervisor_name = request.data.get('supervisor_name')
    #     from_date = request.data.get('from_date')
    #     to_date = request.data.get('to_date')

    #     # Check for missing parameters
    #     if not supervisor_name or not from_date or not to_date:
    #         return Response({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

    #     # Parse the date strings
    #     try:
    #         from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
    #         to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
    #     except ValueError:
    #         return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    #     # Filter attendance records based on supervisor name and date range
    #     attendance_records = EmployeeAttendance.objects.filter(
    #         supervisor_name__icontains=supervisor_name,
    #         date_of_work__range=[from_date, to_date]
    #     ).values('date_of_work') \
    #     .annotate(
    #         total_sk=Sum('sk'),
    #         total_ssk=Sum('ssk'),
    #         total_usk=Sum('usk')    
    #     )

    #     # Filter JobSetDetails records based on supervisor name and date range
    #     job_set_records = JobSetDetails.objects.filter(
    #         supervisor_name__icontains=supervisor_name,
    #         date__range=[from_date, to_date]
    #     )

    #     # Initialize the result list for skilled, semi-skilled, and unskilled values
    #     job_set_summary = []
    #     for job_set in job_set_records:
    #         skilled = (job_set.low_stub/3) + (job_set.hole/1)
    #         semi_skilled = (job_set.anode_covering/4)+ (job_set.side_making/5) + (job_set.supply/1)
    #         unskilled = (job_set.house_keeping/1)

    #         job_set_summary.append({
    #             "date": job_set.date,
    #             "supervisor_name": job_set.supervisor_name,
    #             "skilled": skilled,
    #             "semi_skilled": semi_skilled,
    #             "unskilled": unskilled
    #         })

    #     # If no job set records found, return an appropriate message
    #     if not job_set_summary:
    #         return Response({"message": "No job set records found for the given date range and supervisor."}, status=status.HTTP_404_NOT_FOUND)

    #     # Return both the attendance and job set summary
    #     return Response({
    #         "attendance_records": [
    #             {
    #                 "date": record['date_of_work'],
    #                 "total_sk": record['total_sk'],
    #                 "total_ssk": record['total_ssk'],
    #                 "total_usk": record['total_usk']
    #             } for record in attendance_records
    #         ],
    #         "job_set_summary": job_set_summary
    #     }, status=status.HTTP_200_OK)

    def post(self, request):
        # Extract parameters from the request
        supervisor_name = request.data.get('supervisor_name')  # Optional
        from_date = request.data.get('from_date')
        to_date = request.data.get('to_date')
        # Check for missing required parameters
        if not from_date or not to_date:
            return Response({"error": "Missing required parameters: from_date and to_date."}, status=status.HTTP_400_BAD_REQUEST)
        # Parse the date strings
        try:
            from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
            to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        # Filter attendance records based on date range and optional supervisor name
        attendance_filter = {
            "date_of_work__range": [from_date, to_date]
        }
        if supervisor_name:
            attendance_filter["supervisor_name__icontains"] = supervisor_name
        attendance_records = EmployeeAttendance.objects.filter(**attendance_filter).values('date_of_work', 'supervisor_name','zone','shift') \
            .annotate(
                total_sk=Sum('sk'),
                total_ssk=Sum('ssk'),
                total_usk=Sum('usk')
            )
        # Filter JobSetDetails records based on date range and optional supervisor name
        job_set_filter = {
            "date__range": [from_date, to_date]
        }
        if supervisor_name:
            job_set_filter["supervisor_name__icontains"] = supervisor_name
        job_set_records = JobSetDetails.objects.filter(**job_set_filter)
        # Initialize the result list for skilled, semi-skilled, and unskilled values
        job_set_summary = []
        for job_set in job_set_records:
            skilled = (job_set.low_stub / 3) + (job_set.hole / 1)
            semi_skilled = (job_set.anode_covering / 4) + (job_set.side_making / 5) + (job_set.supply / 1)
            unskilled = (job_set.house_keeping / 1)
            job_set_summary.append({
                "date": job_set.date,
                "supervisor_name": job_set.supervisor_name,
                "zone":job_set.zone,
                "shift":job_set.shift,
                "skilled": skilled,
                "semi_skilled": semi_skilled,
                "unskilled": unskilled
            })
        # If no records found, return an appropriate message
        if not attendance_records and not job_set_summary:
            return Response({"message": "No records found for the given date range."}, status=status.HTTP_404_NOT_FOUND)
        # Return both the attendance and job set summary
        return Response({
            "attendance_records": [
                {
                    "date": record['date_of_work'],
                    "supervisor_name": record['supervisor_name'],
                    "zone":record['zone'],
                    "shift":record['shift'],
                    "total_sk": record['total_sk'], 
                    "total_ssk": record['total_ssk'],
                    "total_usk": record['total_usk']
                } for record in attendance_records
            ],
            "job_set_summary": job_set_summary
        }, status=status.HTTP_200_OK)