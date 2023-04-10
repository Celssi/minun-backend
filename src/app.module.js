"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var announcement_entity_1 = require("./models/announcement.entity");
var company_entity_1 = require("./models/company.entity");
var role_entity_1 = require("./models/role.entity");
var permission_entity_1 = require("./models/permission.entity");
var lockType_entity_1 = require("./models/lockType.entity");
var user_entity_1 = require("./models/user.entity");
var resident_entity_1 = require("./models/resident.entity");
var apartment_entity_1 = require("./models/apartment.entity");
var condominium_entity_1 = require("./models/condominium.entity");
var invitation_entity_1 = require("./models/invitation.entity");
var condominiumFile_entity_1 = require("./models/condominiumFile.entity");
var key_entity_1 = require("./models/key.entity");
var keyHistory_entity_1 = require("./models/keyHistory.entity");
var announcements_module_1 = require("./modules/announcements.module");
var users_module_1 = require("./modules/users.module");
var login_module_1 = require("./modules/login.module");
var AppModule = /** @class */ (function () {
  function AppModule() {
  }

  AppModule = __decorate([
    common_1.Module({
      imports: [
        typeorm_1.TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'password',
          database: 'minun',
          logging: true,
          entities: [
            announcement_entity_1.Announcement,
            company_entity_1.Company,
            role_entity_1.Role,
            permission_entity_1.Permission,
            lockType_entity_1.LockType,
            user_entity_1.User,
            resident_entity_1.Resident,
            apartment_entity_1.Apartment,
            condominium_entity_1.Condominium,
            invitation_entity_1.Invitation,
            condominiumFile_entity_1.CondominiumFile,
            key_entity_1.Key,
            keyHistory_entity_1.KeyHistory,
          ],
          synchronize: true
        }),
        announcements_module_1.AnnouncementsModule,
        users_module_1.UsersModule,
        login_module_1.LoginModule,
      ],
      controllers: [],
      providers: []
    })
  ], AppModule);
  return AppModule;
}());
exports.AppModule = AppModule;
