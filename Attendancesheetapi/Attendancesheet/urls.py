
from django.urls import path,include
from Attendancesheet.views import UserRegisterView,UserLoginView,UserProfileView,UserPasswordChangeView,EmployeeRegisterView,EmployeeDeleteview,EmployeeSearchView,SendOTPView,ResetPasswordView,EmployeeAttendanceAPIView,LogoutView,EmployeeAttendanceSearchAPIView,TokenRefreshView,EmployeeAttendanceSearchView,AttendanceReport,AttendanceUpdateview,TimeSheetCalculate,JobSetDetailsAPIView,TimeSheetJobSheet


urlpatterns = [
    
    path('register/',UserRegisterView.as_view(),name='register'),
    path('login/',UserLoginView.as_view(),name='login'),
    path('profile/',UserProfileView.as_view(),name='profile'),
    path('changepassword/',UserPasswordChangeView.as_view(),name='changepassword'),
    path('employees/create/', EmployeeRegisterView.as_view(), name='employee_Register'),
    path('employees/<str:employee_code>/', EmployeeDeleteview.as_view(), name='employee-delete'),
    path('employee/search/', EmployeeSearchView.as_view(), name='employee_search'),
    path('employee/search/<str:all>/', EmployeeSearchView.as_view(), name='All employee_search'),
    path('sendOtp/', SendOTPView.as_view(), name='send-otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('attendance/', EmployeeAttendanceAPIView.as_view(), name='attendance-list-create'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('report/', EmployeeAttendanceSearchAPIView.as_view(), name='report'),#Attendace search by from date to to date
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('attendance/search/',EmployeeAttendanceSearchView.as_view(), name='attendance_search'),
    path('attendance/update/<str:date_of_work>/<str:employee_code>/',AttendanceUpdateview.as_view(), name='attendance_update'),
    path('month/', AttendanceReport.as_view(), name='report'),
    path('compare/', TimeSheetCalculate.as_view(), name='calculate all sk, ssk, uk values'),
    path('jobsheet/',JobSetDetailsAPIView.as_view(),name='JobSetDetails'),
    path('jobsheet_timesheet/',TimeSheetJobSheet.as_view(),name='compaire jobsheet and timesheet'),

]
