import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as iconv from 'iconv-lite';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AxiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 获取ip地址
   * @returns {Promise<string>}
   */
  async getIpAddress(ip: string): Promise<string> {
    try {
      const IP_URL = 'https://whois.pconline.com.cn/ipJson.jsp';
      const response = await this.httpService.axiosRef(`${IP_URL}?ip=${ip}&json=true`, {
        responseType: 'arraybuffer',
        transformResponse: [
          function (data) {
            console.log(data);
            // 解决中文乱码问题
            const str = iconv.decode(data, 'gbk');
            return JSON.parse(str);
          },
        ],
      });
      return response.data.addr;
    } catch (error) {
      console.error(error);
      return '未知';
    }
  }

  async getSwaggerJson() {
    try {
      const prefix = this.configService.get('application.prefix') || '';
      const host = this.configService.get('swagger.host') || 'localhost';
      const basePath = this.configService.get('swagger.basePath') || 'api-docs';
      const IP_URL = `http://${host}${prefix}/${basePath}-json`;

      const response = await this.httpService.axiosRef.get(IP_URL, {
        responseType: 'json',
      });
      return response.data;
    } catch (e) {
      return null;
    }
  }
}
